import type { Orderbook } from "../types.ts";

type Side = "SELL_BASE" | "SELL_QUOTE";
// SELL_BASE: sell SUI -> get DBUSDC (fill bids)
// SELL_QUOTE: sell DBUSDC -> get SUI (fill asks)

export function simulateMarket(ob: Orderbook, side: Side, amountIn: number) {
  const levels = (side === "SELL_BASE" ? ob.bids : ob.asks)
    .map(([p, s]) => ({ price: Number(p), sizeBase: Number(s) }))
    .filter((x) => x.price > 0 && x.sizeBase > 0);

  if (levels.length === 0 || amountIn <= 0) {
    return { expectedOut: 0, avgPrice: 0, slippageBps: 0, fullyFilled: false };
  }

  // bids: highest first, asks: lowest first
  levels.sort((a, b) =>
    side === "SELL_BASE" ? b.price - a.price : a.price - b.price,
  );

  const topPrice = levels[0].price;

  let remaining = amountIn;
  let out = 0;
  let filledIn = 0;

  for (const lvl of levels) {
    if (remaining <= 0) break;

    if (side === "SELL_BASE") {
      // amountIn is base (SUI)
      const fillBase = Math.min(remaining, lvl.sizeBase);
      out += fillBase * lvl.price; // quote out
      filledIn += fillBase;
      remaining -= fillBase;
    } else {
      // amountIn is quote (DBUSDC)
      const maxQuoteAtLevel = lvl.sizeBase * lvl.price;
      const spendQuote = Math.min(remaining, maxQuoteAtLevel);
      out += spendQuote / lvl.price; // base out
      filledIn += spendQuote;
      remaining -= spendQuote;
    }
  }

  const fullyFilled = remaining <= 1e-12;

  const avgPrice =
    side === "SELL_BASE"
      ? filledIn > 0
        ? out / filledIn
        : 0 // quote/base
      : out > 0
        ? filledIn / out
        : 0; // quote/base

  const slippageBps =
    side === "SELL_BASE"
      ? Math.max(0, ((topPrice - avgPrice) / topPrice) * 10_000)
      : Math.max(0, ((avgPrice - topPrice) / topPrice) * 10_000);

  return { expectedOut: out, avgPrice, slippageBps, fullyFilled };
}
