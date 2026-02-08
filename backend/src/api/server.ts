import { Hono } from "hono";
import { z } from "zod";

import { CONFIG } from "../config.ts";
import type { IntentSpec, Quote } from "../types.ts";

import { getOrderbook } from "../deepbook_read/indexer.ts";
import { simulateMarket } from "../deepbook_read/simulate.ts";
import { executeSwap } from "../deepbook_write/execute.ts";

const app = new Hono();

const IntentSchema = z.object({
  poolId: z.string(),
  intentId: z.string(),
  owner: z.string(),
  type: z.literal("SWAP"),
  sell: z.object({ symbol: z.string(), amount: z.number().positive() }),
  buy: z.object({ symbol: z.string() }),
  constraints: z.object({
    maxSlippageBps: z.number().int().nonnegative(),
    timeLimitSec: z.number().int().positive(),
  }),
});

function normalizeSymbol(sym: string) {
  return CONFIG.symbolAlias[sym.toUpperCase()] ?? sym.toUpperCase();
}

function resolveSide(sellSymbol: string) {
  // Our pool is SUI_DBUSDC. If selling SUI -> SELL_BASE else SELL_QUOTE.
  return sellSymbol === "SUI" ? "SELL_BASE" : "SELL_QUOTE";
}

app.post("/quote", async (c) => {
  try {
    const body = await c.req.json();
    const intent = IntentSchema.parse(body) as IntentSpec;

    const sell = normalizeSymbol(intent.sell.symbol);
    const buy = normalizeSymbol(intent.buy.symbol);

    // MVP: enforce only SUI <-> DBUSDC on testnet
    const allowed =
      (sell === "SUI" && buy === "DBUSDC") ||
      (sell === "DBUSDC" && buy === "SUI");
    if (!allowed)
      return c.json({ error: "MVP supports only SUI <-> DBUSDC" }, 400);

    const side = resolveSide(sell);
    const ob = await getOrderbook(CONFIG.poolKey, 10);
    const sim = simulateMarket(ob, side, intent.sell.amount);

    const quote: Quote = {
      poolKey: intent.poolId,
      side,
      amountIn: intent.sell.amount,
      expectedOut: sim.expectedOut,
      avgPrice: sim.avgPrice,
      slippageBps: sim.slippageBps,
      fullyFilled: sim.fullyFilled,
      timestampMs: ob.timestamp,
    };

    // Safety: enforce max slippage
    if (quote.slippageBps > intent.constraints.maxSlippageBps) {
      return c.json(
        { ...quote, rejected: true, reason: "SLIPPAGE_TOO_HIGH" },
        200,
      );
    }

    return c.json(quote);
  } catch {
    return c.json(
      {
        error: "INVALID_JSON_BODY",
        hint: "Send JSON with Content-Type: application/json",
      },
      400,
    );
  }
});

app.post("/execute", async (c) => {
  const body = await c.req.json();
  const intent = IntentSchema.parse(body) as IntentSpec;

  const sell = normalizeSymbol(intent.sell.symbol);
  const buy = normalizeSymbol(intent.buy.symbol);

  const allowed =
    (sell === "SUI" && buy === "DBUSDC") ||
    (sell === "DBUSDC" && buy === "SUI");
  if (!allowed)
    return c.json({ error: "MVP supports only SUI <-> DBUSDC" }, 400);

  // For a safe demo: always quote first and enforce constraints again
  const side = resolveSide(sell);
  const ob = await getOrderbook(CONFIG.poolKey, 10);
  const sim = simulateMarket(ob, side, intent.sell.amount);

  if (sim.slippageBps > intent.constraints.maxSlippageBps) {
    return c.json(
      {
        error: "SLIPPAGE_TOO_HIGH",
        slippageBps: sim.slippageBps,
        max: intent.constraints.maxSlippageBps,
      },
      400,
    );
  }

  const receipt = await executeSwap({
    poolId: intent,
    intentId: intent.intentId,
    owner: intent.owner,
    poolKey: CONFIG.poolKey,
    side,
    amount: intent.sell.amount,
    minOut: 0, // later: set minOut from sim.expectedOut * (1 - slippage)
  });

  return c.json(receipt);
});

Deno.serve({ port: 8787 }, app.fetch);
