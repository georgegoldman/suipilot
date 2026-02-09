"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@mysten/sui/transactions";

import type { IntentSpec, Quote } from "@/lib/types";
import { CommandTerminal } from "./_components/command-terminal";
import { ReviewCard } from "./_components/review-card";
import { WalletOverlay } from "./_components/wallet-overlay";
import { SuccessToast } from "./_components/success-toast";
import { dAppKit } from "../dapp-kit";

type TradePhase = "idle" | "review" | "signing" | "executing" | "success";

type AgentResult = {
  text: string;
  transaction: Transaction | null;
  intent: IntentSpec | null;
  quote?: Quote | null; // optional until you implement real quoting
};

export default function TradePage() {
  const [phase, setPhase] = useState<TradePhase>("idle");
  const [aiResponse, setAiResponse] = useState("");
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);
  const [pendingIntent, setPendingIntent] = useState<IntentSpec | null>(null);
  const [pendingQuote, setPendingQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [digest, setDigest] = useState<string | null>(null);

  function handleParsed(result: AgentResult) {
    console.log("AI Result:", result);
    setAiResponse(result.text);
    setError(null);

    // ✅ Only enter review when we have both tx + intent
    if (result.transaction && result.intent) {
      setPendingTx(result.transaction);
      setPendingIntent(result.intent);
      setPendingQuote(result.quote ?? null);
      setPhase("review");
    } else {
      setPendingTx(null);
      setPendingIntent(null);
      setPendingQuote(null);
      setPhase("idle");
    }
  }

  async function handleExecute() {
    if (!pendingTx) return;
    try {
      // will throw if the tx is malformed
      pendingTx.getData();
      console.log("TX ok:", pendingTx);
    } catch (e) {
      console.error("TX is invalid / not serializable:", e);
      setError("Transaction is invalid (cannot be serialized).");
      setPhase("review");
      return;
    }

    setPhase("signing");

    try {
      const result = await dAppKit.signAndExecuteTransaction({
        transaction: pendingTx,
      });

      if (result?.FailedTransaction) {
        console.error("Transaction failed:", result.FailedTransaction);
        setError("Transaction failed. Check console for details.");
        setPhase("review");
        return;
      }

      setDigest(result?.Transaction?.digest ?? null);
      setPhase("success");
      setTimeout(resetState, 5000);
    } catch (e) {
      console.error("Wallet rejected / wallet error:", e);
      setError("Transaction was rejected or wallet failed.");
      setPhase("review"); // 🔥 important so overlay disappears
    }
  }

  function resetState() {
    setPendingTx(null);
    setPendingIntent(null);
    setPendingQuote(null);
    setAiResponse("");
    setError(null);
    setDigest(null);
    setPhase("idle");
  }

  const isTerminalDisabled = !["idle", "review"].includes(phase);
  const isExecuting = phase === "signing" || phase === "executing";

  return (
    <div className="relative flex h-screen flex-col pt-20">
      <div className="bg-brand-accent/[0.04] pointer-events-none absolute top-0 left-1/4 size-[600px] rounded-full blur-[120px]" />
      <div className="bg-brand-accent/[0.03] pointer-events-none absolute right-1/4 bottom-0 size-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-auto px-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 w-full max-w-2xl"
          >
            <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-4">
              <p className="text-destructive text-sm">{error}</p>
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
              <h1 className="mb-4 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                AI Intent Trading
              </h1>
              {aiResponse ? (
                <p className="text-brand-accent mx-auto max-w-md text-lg font-medium">
                  {aiResponse}
                </p>
              ) : (
                <p className="text-brand-muted mx-auto max-w-md text-lg font-light">
                  Express your trading goals in natural language.
                </p>
              )}
            </motion.div>
          )}

          {phase === "review" && pendingTx && pendingIntent && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <ReviewCard
                intent={pendingIntent}
                quote={pendingQuote} // can be null/undefined now if you made ReviewCard optional
                onCancel={resetState}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl shrink-0 px-4 pb-8">
        <CommandTerminal
          onIntentParsed={handleParsed}
          onError={(err) => setError(err)}
          disabled={isTerminalDisabled}
        />
      </div>

      <AnimatePresence>
        {phase === "signing" && <WalletOverlay />}
      </AnimatePresence>

      {phase === "success" && (
        <SuccessToast txDigest={digest ?? "no digest"} onDismiss={resetState} />
      )}
    </div>
  );
}
