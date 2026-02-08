import { Type, Schema } from "@google/genai";

// Helper to map simplified Tickers to full Coin Types
// You will use this in your execution logic, not inside the tool definition
export const COIN_MAP: Record<string, string> = {
  SUI: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  USDC: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC", // Example USDC on Testnet
  DEEP: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP", // Replace with actual
};

// Tool: Place Limit Order
const placeLimitOrderDeclaration = {
  name: "place_limit_order",
  description:
    "Places a limit order on the order book. Use this when the user wants to buy or sell at a specific price.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      pair: {
        type: Type.STRING,
        description:
          'The trading pair, e.g., "SUI/USDC". Base is first, Quote is second.',
      },
      side: {
        type: Type.STRING,
        description: 'The direction of the trade. Must be "buy" or "sell".',
      },
      price: {
        type: Type.NUMBER,
        description:
          "The price to buy/sell at. Note: User input might be raw, convert to integers later.",
      },
      quantity: {
        type: Type.NUMBER,
        description: "The amount of the base asset to trade.",
      },
    },
    required: ["pair", "side", "price", "quantity"],
  },
};

// Tool: Place Market Order
const placeMarketOrderDeclaration = {
  name: "place_market_order",
  description:
    'Places a market order for immediate execution. Use this when the user wants to buy/sell "now" or "at best price".',
  parameters: {
    type: Type.OBJECT,
    properties: {
      pair: {
        type: Type.STRING,
        description: 'The trading pair, e.g., "SUI/USDC".',
      },
      side: {
        type: Type.STRING,
        description: 'The direction of the trade: "buy" or "sell".',
      },
      quantity: {
        type: Type.NUMBER,
        description: "The amount of base asset to trade.",
      },
    },
    required: ["pair", "side", "quantity"],
  },
};

// Tool: Create Balance Manager
const createManagerDeclaration = {
  name: "create_balance_manager",
  description:
    "Creates a new Balance Manager account for the user. Required before they can trade.",
  parameters: {
    type: Type.OBJECT,
    properties: {}, // No arguments needed, we use the user's address from context
  },
};

// Tool: Deposit Funds
const depositDeclaration = {
  name: "deposit_funds",
  description:
    "Deposits assets from the users wallet into their DeepBook Balance Manager.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      asset: {
        type: Type.STRING,
        description: 'The coin ticker to deposit, e.g., "SUI" or "USDC".',
      },
      amount: {
        type: Type.NUMBER,
        description: "The amount to deposit.",
      },
    },
    required: ["asset", "amount"],
  },
};

// Export the array of tools
export const deepbookTools = [
  placeLimitOrderDeclaration,
  placeMarketOrderDeclaration,
  createManagerDeclaration,
  depositDeclaration,
];
