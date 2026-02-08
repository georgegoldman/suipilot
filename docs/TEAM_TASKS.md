# AI Intent Trading Copilot — Team Technical Tasks
Hackathon: ETHGlobal HackMoney 2026  
Track: Sui / DeepBook  
Runtime: Deno + TypeScript  
Network: Sui Testnet

---

## 🎯 Project Goal

Build a **user-facing AI Intent Trading Copilot** that:
- accepts natural-language trading intents
- converts them into structured intents
- executes real trades on DeepBook (testnet)
- keeps user preferences private using Seal + Walrus

The priority is **a clean, real demo**, not feature completeness.

---

## 🧩 Team Roles

- **Backend / Contracts (You)**  
  DeepBook execution, Sui txs, storage, APIs

- **AI / ML Engineer**  
  Intent parsing + explanations (schema-bound)

- **Frontend Engineer**  
  Wallet UX, intent input, quote + receipt display

---

# 🔵 BACKEND / CONTRACT TASKS (CRITICAL PATH)

## 1. Environment & Runtime
- Use **Deno + TypeScript**
- Use `@mysten/sui` and `@mysten/deepbook-v3`
- Network: **testnet**
- Maintain a working **CLI fallback**

### Deliverables
- `deno.json` locked and committed
- Testnet RPC configured
- Funded testnet wallet

---

## 2. Canonical Types (BLOCKING)
Create shared types used by AI + FE.

**File:** `src/types.ts`

```ts
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
};

export type Quote = {
  expectedOut: string;
  priceImpactBps: number;
  slippageBps: number;
  routePlan: {
    poolKey: string;
    orderType: "MARKET" | "LIMIT";
  };
};

export type ExecutionReceipt = {
  intentId: string;
  txDigest: string;
  avgPrice: string;
  slippageBps: number;
  timestamp: number;
};
```

---
## 3. DeepBook Pool Discovery
Fetch real testnet pools from the DeepBook indexer.

**File**: `src/deepbook/pools.ts`
### Responsibilities:

- Fetch /get_pools

- Select SUI_USDC or SUI_DBUSDC

- Also detect DEEP_SUI (for fees)

### Deliverables

- Script to list pools

- Confirm working pool keys

- Commit pool constants

---

## 4. Quote Engine (REAL DATA)
Generate a real quote from DeepBook orderbook.

**File**: `src/deepbook/quote.ts`
### Responsibilities:
- Read orderbook

- Simulate market fill

- Compute:
  - expectedOut
  
  - slippage
  
  - price impact

⚠️ Must be deterministic
⚠️ No AI here

---

## 5. DeepBook Execution (CORE)

Execute a real swap on testnet.

**File**: `src/deepbook/execute.ts`

### Responsibilities:

- Build tx using DeepBook SDK

- Handle DEEP fee input

- Sign with testnet key

- Submit tx

- Return tx digest

### Success Criteria

- Produces a real tx hash on testnet

- Funds move on-chain

- Works from CLI

---

## 6. Storage & Privacy (Seal + Walrus)

Store encrypted preferences and execution logs.

**Files**:
- `src/storage/seal.ts`

- `src/storage/walrus.ts`

### Responsibilities:

- Encrypt preferences JSON

- Upload encrypted blob to Walrus

- Return blob ID + policy ID

⚠️ No plaintext preferences stored

---

## 7. Backend API

Expose minimal endpoints.

**File**: `src/api/server.ts`

Endpoints:

- POST /quote

- POST /execute

- POST /preferences/store

Must:

- Validate schemas

- Return typed responses

- Fail loudly on bad input

---

## 8. CLI (DEMO INSURANCE)

CLI must work even if UI breaks.

**File**: `src/cli/main.ts`

Flow:

1. Build IntentSpec

2. Call /quote

3. Call /execute

4. Print receipt

---

# 🟢 AI / ML TASKS

## 1. Intent Parsing (STRICT)

Convert NL → `IntentSpec`.

### Responsibilities
- Use fixed JSON schema

- No free text output

- Reject ambiguous intents

Example input:

 "Swap 5 USDC to SUI with max 0.3% slippage"

Output:
```
{
  "type": "SWAP",
  "sell": { "coinType": "USDC", "amount": "5" },
  "buy": { "coinType": "SUI" },
  "constraints": { "maxSlippageBps": 30 }
}
```

---

## 2. Explanation Generator

### Explain:

- why this route

- expected slippage

- execution result

⚠️ Explanations must NOT change execution

---

## 3. Guardrails
- Schema validation

- Hard defaults

- No hallucinated numbers

---

# 🟣 FRONTEND TASKS
## 1. Wallet + Network
- Sui wallet connect

- Testnet only

- Display connected address

---

## 2. Intent Input UI
- Text box for intent
- Submit → backend `/quote`

---

## 3. Quote Preview
### Display:

- expected output

- slippage

- pool used

---

## 4. Execution Flow

- User confirms

- Wallet signs

- Show tx digest + success

---

## 5. Receipt Screen

### Show:

- tx hash (clickable)

- execution summary

- AI explanation

---

## ⏱️ DAILY MILESTONES 

### Day 1
- Backend: real DeepBook swap from CLI
- AI: intent → JSON working
- FE: wallet + input UI
### Day 2
- Backend: quote + Seal/Walrus storage
- AI: explanations
- FE: quote + receipt views
### Day 3
- Demo polish
- Error handling
- Error handling

---

# 🚫 Out of Scope (DO NOT BUILD)
- Multiple pairs
- Solver networks
- zkML
- Strategy bots
- Fancy charts
---

# 🏁 Definition of Done
- One clean intent

- One real DeepBook testnet trade

- One successful demo

- No crashes
