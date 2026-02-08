export type IntentSpec = {
  intentId: string;
  owner: string;
  type: "SWAP";
  sell: { symbol: string; amount: number }; // human units
  buy: { symbol: string };
  constraints: {
    maxSlippageBps: number;
    timeLimitSec: number;
  };
};

export type Orderbook = {
  bids: [string, string][];
  asks: [string, string][];
  timestamp: string;
};

export type Quote = {
  poolKey: string;
  side: "SELL_BASE" | "SELL_QUOTE";
  amountIn: number;
  expectedOut: number;
  avgPrice: number; // quote/base
  slippageBps: number;
  fullyFilled: boolean;
  timestampMs: string;
};

export type ExecutionReceipt = {
  intentId: string;
  txDigest: string;
  poolKey: string;
  timestamp: number;
};
