"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@mysten/sui/transactions"; // Ensure this matches utils/deepbook.ts

import { CommandTerminal } from "./_components/command-terminal";
import { ReviewCard } from "./_components/review-card";
import { WalletOverlay } from "./_components/wallet-overlay";
import { SuccessToast } from "./_components/success-toast";
import { dAppKit } from "../dapp-kit";

type TradePhase = "idle" | "review" | "signing" | "executing" | "success";

export default function TradePage() {
  const [phase, setPhase] = useState<TradePhase>("idle");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [digest, setDigest] = useState<string | null>(null);

  // 1. Handle response from AI
  function handleParsed(result: {
    text: string;
    transaction: Transaction | null;
  }) {
    console.log("AI Result:", result); // Debug log
    setAiResponse(result.text);
    setError(null);

    if (result.transaction) {
      setPendingTx(result.transaction);
      setPhase("review");
    } else {
      setPhase("idle");
    }
  }

  // 2. Execute the Transaction
  async function handleExecute() {
    if (!pendingTx) {
      console.error("No pending transaction found");
      return;
    }

    setPhase("signing");

    // CRITICAL: The object passed here must have the property 'transaction'
    const result = await dAppKit.signAndExecuteTransaction({
      transaction: pendingTx,
    });
    if (result.FailedTransaction) {
      console.error("Transaction failed:", result.FailedTransaction);
      setError("Transaction failed. Check console for details.");
      setPhase("review");
    } else {
      console.log("Execution Success:", result);
      setDigest(result.Transaction.digest);
      setPhase("success");
      setTimeout(resetState, 5000);
    }
  }

  function resetState() {
    setPendingTx(null);
    setAiResponse("");
    setError(null);
    setDigest(null);
    setPhase("idle");
  }

  const isTerminalDisabled = !["idle", "review"].includes(phase);

  return (
    <div className="relative flex h-screen flex-col pt-20">
      {/* Background Gradients */}
      <div className="bg-brand-accent/[0.04] pointer-events-none absolute top-0 left-1/4 size-[600px] rounded-full blur-[120px]" />
      <div className="bg-brand-accent/[0.03] pointer-events-none absolute right-1/4 bottom-0 size-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-auto px-4">
        {/* Error Message */}
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
          {/* IDLE: Show AI Response or Welcome */}
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

          {/* REVIEW: Show Transaction details */}
          {phase === "review" && pendingTx && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <ReviewCard
                intent={{
                  type: "market_buy", // Mock for visualization
                  sell: { asset: "Asset", amount: "..." },
                  buy: { asset: "Target", amount: "..." },
                }}
                quote={{
                  expectedOut: "Ready to Execute",
                  priceImpactBps: 0,
                  slippageBps: 0,
                  routePlan: {
                    market: "DeepBook V3",
                    orderType: "AI Transaction",
                  },
                }}
                // Make sure your ReviewCard accepts this prop, or remove it if not needed
                aiReasoning={aiResponse}
                onCancel={resetState}
                onExecute={handleExecute}
                isExecuting={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Input */}
      <div className="relative z-10 mx-auto w-full max-w-2xl shrink-0 px-4 pb-8">
        <CommandTerminal
          onIntentParsed={handleParsed}
          onError={(err) => setError(err)}
          disabled={isTerminalDisabled}
        />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {phase === "signing" && <WalletOverlay />}
      </AnimatePresence>

      {phase === "success" && (
        <SuccessToast digest={digest} onDismiss={resetState} />
      )}
    </div>
  );
}
