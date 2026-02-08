"use client";

import { motion } from "framer-motion";
import type { IntentSpec, Quote } from "@/lib/types";

interface SimulationViewProps {
  intent: IntentSpec;
  quote: Quote;
}

export function SimulationView({ intent, quote }: SimulationViewProps) {
  const fromToken = intent.sell.coinType.split("::").pop() || "UNKNOWN";
  const toToken = intent.buy.coinType.split("::").pop() || "UNKNOWN";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2A8DFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium">Simulating Transaction</h3>
            <p className="text-brand-muted text-xs">
              Verifying safety constraints...
            </p>
          </div>
        </div>

        <div className="space-y-0 mb-6">
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-brand-muted text-sm">Send</span>
            <span className="text-white text-sm font-medium">
              {intent.sell.amount} {fromToken}
            </span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-brand-muted text-sm">Receive (est.)</span>
            <span className="text-white text-sm font-medium">
              ~{quote.expectedOut} {toToken}
            </span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-brand-muted text-sm">Price Impact</span>
            <span className="text-green-400 text-sm font-medium">
              {(quote.priceImpactBps / 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-brand-muted text-sm">Risk Level</span>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-green-400" />
              Low
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <span className="size-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-brand-muted text-sm">
            Simulation in progress...
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
