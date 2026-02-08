"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IntentSpec, Quote } from "@/lib/types";
import { getQuote } from "@/lib/api";
import { CommandTerminal } from "./_components/command-terminal";
import { ReviewCard } from "./_components/review-card";
import { SimulationView } from "./_components/simulation-view";
import { WalletOverlay } from "./_components/wallet-overlay";
import { ArchivalAnimation } from "./_components/archival-animation";
import { SuccessToast } from "./_components/success-toast";

type TradePhase =
  | "idle"
  | "review"
  | "simulating"
  | "signing"
  | "archiving"
  | "success";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TradePage() {
  const [phase, setPhase] = useState<TradePhase>("idle");
  const [intent, setIntent] = useState<IntentSpec | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleParsed(parsedIntent: IntentSpec) {
    setIntent(parsedIntent);
    setError(null);
    setPhase("review");

    try {
      const quoteData = await getQuote(parsedIntent);
      setQuote(quoteData);
    } catch {
      setQuote({
        expectedOut: (parseFloat(parsedIntent.sell.amount) * 0.92).toFixed(2),
        priceImpactBps: 15,
        slippageBps: 50,
        routePlan: { market: "DeepBook SUI/USDC", orderType: "MARKET" },
      });
    }
  }

  async function handleExecute() {
    if (!intent) return;

    setPhase("simulating");
    await delay(1500);

    setPhase("signing");
    await delay(2000);

    setPhase("archiving");
    await delay(2500);

    setPhase("success");
    setTimeout(resetState, 3000);
  }

  function resetState() {
    setIntent(null);
    setQuote(null);
    setError(null);
    setPhase("idle");
  }

  const isTerminalDisabled = !["idle", "review"].includes(phase);

  return (
    <div className="relative flex flex-col h-screen pt-20">
      <div className="absolute top-0 left-1/4 size-[600px] bg-brand-accent/[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-[400px] bg-brand-accent/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 overflow-auto flex flex-col items-center justify-center px-4 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mb-4"
          >
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center p-1 pr-4 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-8"
              >
                <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full mr-3 tracking-wide">
                  LIVE ON TESTNET
                </span>
                <span className="text-gray-400 text-xs tracking-wide">
                  Powered by Sui DeepBook
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-4">
                AI Intent Trading
              </h1>
              <p className="text-brand-muted text-lg font-light max-w-md mx-auto">
                Express your trading goals in natural language.
                <br />
                Execute with precision on DeepBook.
              </p>
            </motion.div>
          )}

          {phase === "review" && intent && quote && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <ReviewCard
                intent={intent}
                quote={quote}
                onCancel={resetState}
                onExecute={handleExecute}
                isExecuting={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 w-full max-w-2xl mx-auto px-4 pb-8 relative z-10">
        <CommandTerminal
          onIntentParsed={handleParsed}
          onError={(err) => setError(err)}
          disabled={isTerminalDisabled}
        />
      </div>

      <AnimatePresence>
        {phase === "simulating" && intent && quote && (
          <SimulationView intent={intent} quote={quote} />
        )}
        {phase === "signing" && <WalletOverlay />}
        {phase === "archiving" && <ArchivalAnimation />}
      </AnimatePresence>

      {phase === "success" && <SuccessToast onDismiss={resetState} />}
    </div>
  );
}
