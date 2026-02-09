import { GoogleGenAI } from "@google/genai";
import { deepbookTools, COIN_MAP } from "../ai/tools";
import * as dbTx from "../utils/deepbook";
import { Transaction } from "@mysten/sui/transactions";
import type { IntentSpec } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const POOL_IDS: Record<string, string> = {
  "SUI/USDC": "0xPOOL_ID_FOR_SUI_USDC",
};

export type AgentResult = {
  text: string;
  transaction: Transaction | null;
  intent: IntentSpec | null;
  // quote?: Quote | null; // later, when you actually compute it
};

export async function generateDeepBookTransaction(
  userPrompt: string,
  userAddress: string,
  userBalanceManagerId?: string,
): Promise<AgentResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userPrompt,
    config: { tools: [{ functionDeclarations: deepbookTools }] },
  });

  const functionCall = response.functionCalls?.[0];

  if (!functionCall) {
    return {
      text: response.text ?? "I couldn't map that to an action yet.",
      transaction: null,
      intent: null,
    };
  }

  const { name, args } = functionCall;

  let tx: Transaction | null = null;
  let reply = "";
  let intent: IntentSpec | null = null;

  try {
    switch (name) {
      case "create_balance_manager": {
        tx = dbTx.createBalanceManagerTx(userAddress);
        reply = "I've prepared a transaction to create your DeepBook account.";

        intent = {
          intentId: String(Date.now()),
          owner: userAddress,
          action: "CREATE_BALANCE_MANAGER" as unknown, // only if your IntentSpec includes this
          // If not included, set intent=null or use DEPOSIT/WITHDRAW/etc only.
        } as IntentSpec;

        break;
      }

      case "deposit_funds": {
        if (!userBalanceManagerId)
          throw new Error("No Balance Manager found for user.");

        const asset = args!.asset as string; // e.g. "SUI"
        const amount = String(args!.amount); // keep as string
        const coinType = COIN_MAP[asset];

        const mockCoinId = "0xCOIN_OBJECT_ID"; // replace with real coin selection

        tx = dbTx.depositTx(userBalanceManagerId, mockCoinId, coinType);
        reply = `Depositing ${amount} ${asset} into your account.`;

        intent = {
          intentId: String(Date.now()),
          owner: userAddress,
          action: "DEPOSIT",
          balanceManager: { id: userBalanceManagerId },
          sell: { coinType, amount },
          buy: undefined,
          constraints: undefined,
        } as IntentSpec;

        break;
      }

      case "place_limit_order": {
        if (!userBalanceManagerId)
          throw new Error("Please create an account first.");

        const pair = args!.pair as string; // "SUI/USDC"
        const [base, quote] = pair.split("/");
        const side = args!.side as "buy" | "sell";
        const price = String(args!.price);
        const quantity = String(args!.quantity);

        const poolId = POOL_IDS[pair];
        if (!poolId) throw new Error(`Unsupported pair: ${pair}`);

        tx = dbTx.placeLimitOrderTx(
          poolId,
          userBalanceManagerId,
          Date.now(),
          BigInt((args!.price as number) * 1_000_000_000),
          BigInt((args!.quantity as number) * 1_000_000_000),
          side === "buy",
          COIN_MAP[base],
          COIN_MAP[quote],
        );

        reply = `Placing limit order: ${side} ${quantity} ${base} at ${price}.`;

        intent = {
          intentId: String(Date.now()),
          owner: userAddress,
          action: "PLACE_ORDER",
          poolId,
          baseCoinType: COIN_MAP[base],
          quoteCoinType: COIN_MAP[quote],
          balanceManager: { id: userBalanceManagerId },
          order: {
            kind: "LIMIT",
            side: side === "buy" ? "BID" : "ASK",
            quantity: { unit: "BASE", amount: quantity },
            limitPrice: price,
            clientOrderId: String(Date.now()),
          },
        } as IntentSpec;

        break;
      }

      case "place_market_order": {
        if (!userBalanceManagerId)
          throw new Error("Please create an account first.");

        const pair = args!.pair as string;
        const [base, quote] = pair.split("/");
        const side = args!.side as "buy" | "sell";
        const quantity = String(args!.quantity);

        const poolId = POOL_IDS[pair];
        if (!poolId) throw new Error(`Unsupported pair: ${pair}`);

        tx = dbTx.placeMarketOrderTx(
          poolId,
          userBalanceManagerId,
          Date.now(),
          BigInt((args!.quantity as number) * 1_000_000_000),
          side === "buy",
          COIN_MAP[base],
          COIN_MAP[quote],
        );

        reply = `Placing market ${side} order for ${quantity} ${base}.`;

        intent = {
          intentId: String(Date.now()),
          owner: userAddress,
          action: "PLACE_ORDER",
          poolId,
          baseCoinType: COIN_MAP[base],
          quoteCoinType: COIN_MAP[quote],
          balanceManager: { id: userBalanceManagerId },
          order: {
            kind: "MARKET",
            side: side === "buy" ? "BID" : "ASK",
            quantity: { unit: "BASE", amount: quantity },
            clientOrderId: String(Date.now()),
          },
        } as IntentSpec;

        break;
      }

      default: {
        reply = "I don't know how to do that yet.";
        intent = null;
        tx = null;
      }
    }
  } catch (e: unknown) {
    reply = `Error preparing transaction: ${e instanceof Error ? e.message : String(e)}`;
    tx = null;
    intent = null;
  }

  return { text: reply, transaction: tx, intent };
}
