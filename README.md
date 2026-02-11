# 🧠 AI Intent Trading Copilot on Sui

> *Trade with natural language. Execute with precision — privately and safely.*

---

## 🎯 The Big Idea

AI Intent Trading Copilot reimagines crypto trading by letting users express their trading goals in plain English instead of manually configuring complex order parameters.

Say:
> *“I want to buy $500 of SUI when slippage is below 0.3%.”*

The copilot parses your intent, validates strict safety constraints, executes the trade on **DeepBook**, and produces a **verifiable execution receipt** — while keeping your strategy **private by default**.

This is not just an “intent-to-swap” UI.  
It is a **privacy-first, safety-aware AI trading copilot** built with Sui-native primitives.

---

## 🚨 Why This Project Exists

Most intent-based trading tools optimize for **convenience only**:
- “Type what you want”
- “We’ll find the best route”
- “Trust us”

But real trading requires more.

**Trading requires:**
- 🔐 **Privacy** — your strategy shouldn’t be public
- 🛡️ **Safety** — bad trades should be rejected, not executed
- 🧾 **Verifiability** — execution should be provable, not assumed

This project is built to solve all three.

---

## ✨ What Makes This Different (Key Differentiators)

### 🔐 1. Private Intents & Preferences (Core Differentiator)
- User preferences (risk limits, slippage tolerance, constraints):
  - are **encrypted using Seal**
  - stored privately on **Walrus**
  - owned and controlled by the user
- Intent history and execution logs are private by default

> Other tools parse your intent.  
> **We protect your trading strategy.**

---

### 🛡️ 2. Safety-First Constraint Enforcement
Trades are executed **only if all constraints pass**:

- Max slippage or cancel
- Liquidity threshold checks
- Time-bound execution
- Approved DeepBook pool only

If constraints fail → **no transaction is sent**.

> The copilot prevents bad trades instead of blindly executing them.

---

### 🧾 3. Verifiable Best-Execution Receipts
After each trade, the system generates a **best-execution receipt** including:
- Expected vs executed price
- Slippage (bps)
- DeepBook pool used
- Transaction digest

Receipts are stored on **Walrus** (with optional on-chain hashing).

> Not “trust us” — **verify it**.

---

## 🚀 What We’re Building

### 🗣️ Natural Language Trading
- Express goals conversationally:
  > *“Swap 100 USDC for SUI with max 0.3% slippage”*
- AI parses intent into a **strict structured format**
- Users review and confirm before execution

### 📊 DeepBook Integration
- Live orderbook reads for price discovery
- Simulated fills before execution
- Transparent pricing and slippage estimates

### 🔐 Privacy-First Design
- Preferences encrypted with Seal
- No sensitive data stored on-chain
- User controls access to their data

### 💾 Decentralized Storage
- Walrus stores encrypted intent history and execution logs
- Content-addressed references for verifiable receipts

---

## 🏗️ Architecture
```
┌─────────────────┐
│ Web UI │ Natural language intent
└────────┬────────┘
│
┌────────▼────────┐
│ AI Intent │ Text → structured IntentSpec
│ Parser │ (schema-bound, deterministic)
└────────┬────────┘
│
┌────────▼────────┐
│ Quote & Safety │ DeepBook orderbook
│ Engine │ Simulation + constraint checks
└────────┬────────┘
│
┌────────▼────────┐
│ DeepBook │ On-chain execution (testnet)
│ Executor │ Tx digest + events
└────────┬────────┘
│
┌────────▼────────┐
│ Walrus + Seal │ Encrypted preferences
│ Storage │ + execution receipts
└─────────────────┘
```

---

## 🔄 User Flow

1. **Express Intent**  
   *“Buy 50 SUI with USDC, max slippage 0.3%”*

2. **AI Parsing**  
   → strict `IntentSpec`

3. **Orderbook Analysis**  
   → DeepBook simulation + safety checks

4. **Quote Preview**  
   → expected output, slippage, fees

5. **User Confirmation**

6. **On-Chain Execution**  
   → DeepBook transaction on Sui testnet

7. **Receipt & Storage**  
   → encrypted receipt stored on Walrus

---

## 🛠️ Technical Stack

### Sui Ecosystem
- **DeepBook** — on-chain orderbook & execution
- **Sui Intents** — structured, deterministic execution
- **Walrus** — decentralized encrypted storage
- **Seal** — encryption & access control

### Intent Specification
```json
{
  "action": "swap",
  "sell_asset": "USDC",
  "buy_asset": "SUI",
  "amount": "100",
  "constraints": {
    "max_slippage_bps": 30,
    "limit_price": "optional",
    "time_limit_sec": 600
  }
}

```


## 🎬 MVP Scope (ETHGlobal Hackathon)
###   Shipping

✅ Real DeepBook testnet swaps
✅ Intent → quote → execution
✅ Encrypted preferences & logs
✅ Constraint enforcement
✅ CLI fallback for demo reliability

### Out of Scope

- Solver networks

- Multi-chain routing

**Execution Safety**
- Deterministic intent parsing (no ambiguity)
- Explicit user confirmation required
- Replay-resistant transaction design
- Simulation before execution

**Data Minimization**
- No PII on-chain
- Walrus stores only encrypted blobs
- Intent history accessible only to user

## 🌟 Why This Matters

**For Users**
- Lower barrier to entry for DeFi trading
- No need to understand order types, slippage, gas optimization
- Natural language makes DeFi accessible to everyone

**For Sui Ecosystem**
- Showcases power of Sui Intents + DeepBook combination
- Demonstrates Walrus utility for real applications
- Highlights Seal's privacy capabilities

**For DeFi**
- Bridges gap between intent and execution
- Sets foundation for AI-powered trading strategies
- Opens door to sophisticated automation for retail users

## 🚀 Future Vision

This MVP is just the beginning. We envision:

- **Multi-Intent Strategies**: "Buy SUI weekly for the next 3 months with $100 each time"
- **Social Trading**: "Copy Alice's strategy but with 50% of her position size"
- **Solver Marketplace**: Competition among execution engines for best prices
- **On-Chain Settlement**: Fully decentralized intent matching and settlement
- **Cross-Chain**: Extend to multi-chain trading with unified intent language

## 🏁 Getting Started

```bash
# Coming soon - setup instructions for running locally
npm install
npm run dev
```

## 📚 Resources

- [Sui Intents Documentation](https://docs.sui.io)
- [DeepBook Protocol](https://deepbook.tech)
- [Walrus Storage](https://walrus.site)
- [Seal Encryption](https://docs.sui.io/concepts/cryptography/transaction-auth/seal)

## 👥 Team

Built for ETHGlobal by [@georgegoldman](https://github.com/georgegoldman) & @mhiskall282

- Automated strategies

---

## 🌟 Why This Matters

### For Users

- Trade by expressing goals, not mechanics

- Protection from unsafe executions

- Privacy-preserving by default

### For Sui

- Demonstrates Intents + DeepBook in a real app

- Shows meaningful use of Walrus + Seal

- Highlights safety and user ownership



