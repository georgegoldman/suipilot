import { GoogleGenAI } from "@google/genai";
import { deepbookTools, COIN_MAP } from "../ai/tools"; // The file above
import * as dbTx from "../utils/deepbook"; // The transaction builder we wrote earlier
import { Transaction } from "@mysten/sui/transactions";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// MOCK CONSTANTS - In a real app, fetch these from an API or Context
const POOL_IDS: Record<string, string> = {
  "SUI/USDC": "0xPOOL_ID_FOR_SUI_USDC",
};

export async function generateDeepBookTransaction(
  userPrompt: string,
  userAddress: string,
  userBalanceManagerId?: string, // Optional, user might not have one yet
) {
  // 1. Call Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userPrompt,
    config: {
      tools: [{ functionDeclarations: deepbookTools }],
    },
  });

  const functionCall = response.functionCalls?.[0];

  if (!functionCall) {
    return { text: response.text, transaction: null };
  }

  const { name, args } = functionCall;
  let tx: Transaction | null = null;
  let reply = "";

  // 2. Map AI Call -> DeepBook Transaction
  try {
    switch (name) {
      case "create_balance_manager":
        tx = dbTx.createBalanceManagerTx(userAddress);
        reply = "I've prepared a transaction to create your DeepBook account.";
        break;

      case "deposit_funds":
        if (!userBalanceManagerId)
          throw new Error("No Balance Manager found for user.");
        const coinType = COIN_MAP[args!.asset as string];
        // Note: handling 'coinId' is complex. In a real app, you need to query the user's
        // wallet coins to find an object ID that matches the amount.
        // For now, we assume a placeholder or you implement a coin selector helper.
        const mockCoinId = "0xCOIN_OBJECT_ID";

        tx = dbTx.depositTx(userBalanceManagerId, mockCoinId, coinType);
        reply = `Depositing ${args!.amount} ${args!.asset} into your account.`;
        break;

      case "place_limit_order":
        if (!userBalanceManagerId)
          throw new Error("Please create an account first.");
        const pair = args!.pair as string;
        const [base, quote] = pair.split("/");

        tx = dbTx.placeLimitOrderTx(
          POOL_IDS[pair],
          userBalanceManagerId,
          Date.now(), // Client Order ID
          BigInt((args!.price as number) * 1_000_000_000), // Normalize price (simplified)
          BigInt((args!.quantity as number) * 1_000_000_000), // Normalize qty
          args!.side === "buy",
          COIN_MAP[base],
          COIN_MAP[quote],
        );
        reply = `Placing limit order: ${args!.side} ${args!.quantity} ${base} at ${args!.price}.`;
        break;

      case "place_market_order":
        if (!userBalanceManagerId)
          throw new Error("Please create an account first.");
        const mPair = args!.pair as string;
        const [mBase, mQuote] = mPair.split("/");

        tx = dbTx.placeMarketOrderTx(
          POOL_IDS[mPair],
          userBalanceManagerId,
          Date.now(),
          BigInt((args!.quantity as number) * 1_000_000_000),
          args!.side === "buy",
          COIN_MAP[mBase],
          COIN_MAP[mQuote],
        );
        reply = `Placing market ${args!.side} order for ${args!.quantity} ${mBase}.`;
        break;

      default:
        reply = "I don't know how to do that yet.";
    }
  } catch (e: unknown) {
    reply = `Error preparing transaction: ${e}`;
    tx = null;
  }

  return { text: reply, transaction: tx };
}
