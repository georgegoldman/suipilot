# SuiCopilot — AI Intent Trading Copilot UI

## Overview

Full MVP trading interface for SuiCopilot: natural language trading intents, structured review, simulated execution with wallet signing, encrypted archival, and a complete trade vault with privacy locks.

---

## Architecture

### Route Structure

```
app/
├── page.tsx                              # Landing page
├── (app)/                                # App route group (shared navbar)
│   ├── layout.tsx                        # App layout with AppNavbar
│   ├── trade/
│   │   ├── page.tsx                      # Trade page (chat-style layout)
│   │   └── _components/
│   │       ├── command-terminal.tsx       # NL input with suggestion chips
│   │       ├── review-card.tsx           # Transaction review card
│   │       ├── simulation-view.tsx       # Pre-execution simulation overlay
│   │       ├── wallet-overlay.tsx        # Wallet signing overlay
│   │       ├── archival-animation.tsx    # Seal + Walrus archival animation
│   │       └── success-toast.tsx         # Success notification portal
│   ├── history/
│   │   └── page.tsx                      # Trade vault with privacy locks
│   └── settings/
│       └── page.tsx                      # Slippage, speed, privacy, AI prefs
├── components/
│   ├── app/
│   │   └── app-navbar.tsx                # App navigation (Trade/History/Settings)
│   ├── landing/                          # Landing page components
│   └── ui/                              # shadcn/ui components
└── lib/
    ├── api.ts                            # Backend API client + mock fallbacks
    ├── types.ts                          # IntentSpec, Quote, ExecutionReceipt
    └── utils.ts                          # cn utility
```

---

## Screens

### 1. Trade (`/trade`)

Chat-style layout with centered hero and bottom-pinned command terminal.

**State Machine:** `idle → review → simulating → signing → archiving → success`

- **Idle**: Hero badge ("LIVE ON TESTNET"), title, subtitle centered vertically. Terminal at bottom.
- **Review**: ReviewCard replaces hero with trade details (from/to, slippage, impact, fee, route).
- **Simulating**: Full-screen overlay showing constraint verification and simulation progress.
- **Signing**: Wallet overlay with animated dots — "Waiting for wallet signature..."
- **Archiving**: Step-by-step animation (Securing → Encrypting with Seal → Uploading to Walrus).
- **Success**: Toast notification with link to history.

**Command Terminal Features:**

- Textarea with dark card styling (`#0F0F0F`, `border-white/[0.06]`)
- Send button (brand-accent when active, muted when empty)
- Suggestion chips: "Swap 50 SUI for USDC", "Buy 100 USDC with SUI", "Sell 25 SUI for USDC"
- `⌘ + Enter` keyboard shortcut
- Mock quote fallback when API is unavailable

### 2. History / Vault (`/history`)

Encrypted trade receipt vault with Walrus storage.

- **Vault Header**: Title + subtitle + search input
- **Receipt Cards**: Each card shows action, amounts, date, status badge
- **Privacy Lock**: Locked cards show blurred overlay with lock icon — click to decrypt
- **Receipt Detail Modal**: Full receipt with tx hash, gas, slippage, route, storage status
- **Search**: Filter by token or action

### 3. Settings (`/settings`)

Trading preference configuration.

- **Slippage Tolerance**: Preset buttons (0.1%, 0.5%, 1.0%) + custom input
- **Transaction Speed**: Normal / Fast / Instant with gas descriptions
- **Privacy & Storage**: Toggle switches for Seal encryption and Walrus auto-archive
- **AI Preferences**: Default trade size and preferred token pair inputs

---

## Design System

Consistent across all screens, reusing landing page elements:

| Token        | Value                                 |
| ------------ | ------------------------------------- |
| Background   | `#050505`                             |
| Card / Panel | `#0F0F0F`                             |
| Brand Accent | `#2A8DFF`                             |
| Brand Muted  | `#A1A1AA`                             |
| Border       | `border-white/[0.06]`                 |
| Card Radius  | `rounded-2xl`                         |
| Shadow       | `shadow-[0_4px_30px_rgba(0,0,0,0.3)]` |
| Font         | Manrope                               |
| Animations   | Framer Motion                         |

**App Navbar**: Floating pill (same as landing) with active route indicator, wallet status button.

---

## User Flow

1. **Landing** → "Launch App" → `/trade`
2. **Trade** → Type "Swap 50 SUI for USDC" → `⌘+Enter`
3. **Parsing** → Spinner on send button
4. **Review** → ReviewCard slides in with trade details
5. **Execute** → Simulation overlay → Wallet overlay → Archival animation
6. **Success** → Toast with "View History" link
7. **History** → Encrypted receipt cards → Click to decrypt → View details
8. **Settings** → Configure slippage, speed, privacy, AI preferences

---

## Backend Integration

### API Endpoints

| Endpoint   | Method | Purpose                        |
| ---------- | ------ | ------------------------------ |
| `/quote`   | POST   | Get trade quote for IntentSpec |
| `/execute` | POST   | Execute swap on DeepBook       |

**Base URL**: `NEXT_PUBLIC_API_URL` (default `http://localhost:8787`)

Trade page gracefully falls back to mock quotes when API is unavailable.

### Intent Parsing

Currently regex-based in `lib/api.ts`. Pattern: `(?:swap|buy|sell) {amount} {token} for|to {token}`

**Upgrade path**: Replace with AI SDK call to `/api/parse-intent` endpoint using OpenAI/Claude for complex NL understanding.

---

## What's Complete

- [x] App navbar with route indicators and wallet button
- [x] Chat-style trade page with centered hero and bottom terminal
- [x] Command terminal with dark card styling and suggestion chips
- [x] ReviewCard with structured trade details
- [x] Simulation view overlay (constraint verification)
- [x] Wallet signing overlay with animation
- [x] Archival animation (Seal encryption + Walrus upload steps)
- [x] Success toast with history link
- [x] History page with privacy lock cards
- [x] Receipt detail modal with full trade info
- [x] Settings page (slippage, speed, privacy, AI prefs)
- [x] Framer Motion animations throughout
- [x] Consistent design system across all screens
- [x] TypeScript, clean build

## What's Next

- [ ] Real wallet connection (Sui wallet adapter)
- [ ] AI intent parsing (replace regex with LLM)
- [ ] Real DeepBook integration (testnet)
- [ ] Seal encryption integration
- [ ] Walrus storage integration
- [ ] Quote refresh/countdown timer
- [ ] Mobile responsive refinements (bottom sheets)

---

**Status**: MVP UI Complete — All screens, components, and flows implemented.
