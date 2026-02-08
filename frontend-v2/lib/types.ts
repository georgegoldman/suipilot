export type IntentSpec = {
  intentId: string;
  owner: string;
  type: "SWAP";
  sell: { coinType: string; amount: string };
  buy: { coinType: string };
  constraints: {
    maxSlippageBps: number;
    orderType: "MARKET" | "LIMIT";
    timeLimitSec: number;
    limitPrice?: string;
  };
  explain?: boolean;
};

export type Quote = {
  expectedOut: string;
  priceImpactBps: number;
  slippageBps: number;
  routePlan: {
    market: string;
    orderType: "MARKET" | "LIMIT";
    limitPrice?: string;
  };
};

export type ExecutionReceipt = {
  intentId: string;
  txDigest: string;
  fills: Array<{ price: string; size: string }>;
  avgPrice: string;
  slippageBps: number;
  timestamp: number;
};
