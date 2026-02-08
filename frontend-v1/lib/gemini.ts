// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
);

export async function parseIntentWithGemini(intent: string, sender: string) {
  // Use the latest model name
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `You are a DeepBook trading assistant. Parse this trading intent into a structured format.

User intent: "${intent}"
User address: ${sender}

Extract and return ONLY a JSON object (no markdown, no explanation) with this structure:
{
  "action": "Brief description of the trade",
  "poolKey": "Pool identifier (e.g., SUI_DBUSDC, SUI_USDT)",
  "amount": "Amount in smallest unit (e.g., for 50 SUI = 50000000000)",
  "side": "SELL_BASE or BUY_BASE",
  "minOut": "Minimum output after slippage (in smallest unit)",
  "expectedOutput": "Human readable expected output (e.g., ~49.5 USDC)"
}

Available pools: SUI_DBUSDC, SUI_USDT, DBUSDC_USDT
- 1 SUI = 1,000,000,000 MIST (9 decimals)
- 1 USDC = 1,000,000 (6 decimals)
- Apply slippage if mentioned (default 0.5%)

Examples:
"Swap 50 SUI for USDC" → {"action":"Swap 50 SUI → USDC","poolKey":"SUI_DBUSDC","amount":"50000000000","side":"SELL_BASE","minOut":"49500000","expectedOutput":"~49.5 USDC"}
"Buy 100 USDC with SUI" → {"action":"Buy 100 USDC with SUI","poolKey":"SUI_DBUSDC","amount":"100000000","side":"BUY_BASE","minOut":"99500000","expectedOutput":"~99.5 USDC"}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Extract JSON from response (remove markdown if present)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response");
  }

  return JSON.parse(jsonMatch[0]);
}
