import type { IntentSpec, Quote, ExecutionReceipt } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export async function parseIntent(prompt: string): Promise<IntentSpec> {
  const regex = /(?:swap|buy|sell)\s+(\d+(?:\.\d+)?)\s+(\w+)\s+(?:for|to)\s+(\w+)/i;
  const match = prompt.match(regex);

  if (!match) {
    throw new Error("Could not parse intent. Try: 'Swap 50 SUI for USDC'");
  }

  const [, amount, fromToken, toToken] = match;

  return {
    intentId: `intent-${Date.now()}`,
    owner: "0x0000000000000000000000000000000000000000000000000000000000000000",
    type: "SWAP",
    sell: {
      coinType: `0x2::sui::${fromToken.toUpperCase()}`,
      amount: amount,
    },
    buy: {
      coinType: `0x2::coin::${toToken.toUpperCase()}`,
    },
    constraints: {
      maxSlippageBps: 50,
      orderType: "MARKET",
      timeLimitSec: 300,
    },
  };
}

export async function getQuote(intent: IntentSpec): Promise<Quote> {
  const response = await fetch(`${API_BASE}/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(intent),
  });

  if (!response.ok) {
    throw new Error(`Failed to get quote: ${response.statusText}`);
  }

  return response.json();
}

export async function executeSwap(intent: IntentSpec): Promise<ExecutionReceipt> {
  const response = await fetch(`${API_BASE}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(intent),
  });

  if (!response.ok) {
    throw new Error(`Failed to execute swap: ${response.statusText}`);
  }

  return response.json();
}
