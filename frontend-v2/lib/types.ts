export type DeepBookAction =
  | "DEPOSIT"
  | "WITHDRAW"
  | "SWAP_EXACT_IN"
  | "PLACE_ORDER"
  | "CANCEL_ORDER"
  | "MODIFY_ORDER"
  | "CLAIM_REBATES"
  | "FLASH_LOAN"; // optional, but useful later

export type OrderSide = "BID" | "ASK";
export type OrderType = "MARKET" | "LIMIT";
export type TimeInForce = "GTC" | "IOC" | "FOK"; // pick what you support in UI/AI

export type IntentSpec = {
  intentId: string;
  owner: string; // signer address (wallet)

  // What to call
  action: DeepBookAction;

  // Where to trade (needed for all Pool-related actions)
  poolId?: string;
  baseCoinType?: string; // e.g. 0x2::sui::SUI
  quoteCoinType?: string; // e.g. <USDC type>

  // BalanceManager context (required for CLOB actions; swaps may not require it depending on function)
  balanceManager?: {
    id: string;
    // These are often needed when calling DeepBook through Move:
    tradeCap?: string;
    depositCap?: string;
    withdrawCap?: string;
    // some flows use proofs (e.g., TradeProof) instead of caps; keep flexible:
    tradeProof?: string;
  };

  // Unified “sell/buy” for swaps and market-style actions
  sell?: { coinType: string; amount: string };
  buy?: { coinType: string };

  // Order details (for PLACE/MODIFY/CANCEL)
  order?: {
    clientOrderId?: string; // good for your AI + user UX
    orderId?: string; // required for CANCEL/MODIFY
    side?: OrderSide; // BID (buy base with quote) or ASK
    type?: OrderType; // MARKET or LIMIT
    quantity?: string; // in lots/raw units your UI uses
    limitPrice?: string; // required for LIMIT
    timeInForce?: TimeInForce; // optional
    expireTimestampMs?: number; // optional
    selfMatch?: "ALLOW" | "CANCEL_TAKER" | "CANCEL_MAKER"; // optional
  };

  // Safety rails (used by AI to propose, and by UI to validate before signing)
  constraints?: {
    maxSlippageBps?: number; // for swaps/market routes
    maxFeeBps?: number; // optional (if you model fees)
    timeLimitSec?: number; // for “quote expires in”
    minOut?: string; // if you want explicit minOut instead of slippage
  };

  // For your “AI explains then user signs” flow
  explain?: {
    enabled: boolean;
    summary?: string; // short
    reasoning?: string; // longer NL explanation
    risks?: string[]; // bullet list
    simulation?: {
      expectedOut?: string;
      worstCaseOut?: string;
      priceImpactBps?: number;
    };
  };
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
