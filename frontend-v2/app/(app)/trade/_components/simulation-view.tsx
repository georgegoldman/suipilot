"use client";

import { motion } from "framer-motion";
import type { IntentSpec, Quote } from "@/lib/types";

interface SimulationViewProps {
  intent: IntentSpec;
  quote: Quote;
}

export function SimulationView({ intent, quote }: SimulationViewProps) {
  const fromToken = intent.sell?.coinType.split("::").pop() || "UNKNOWN";
  const toToken = intent.buy?.coinType.split("::").pop() || "UNKNOWN";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="mx-4 w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0F0F0F] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-brand-accent/10 flex size-10 items-center justify-center rounded-xl">
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
            <h3 className="font-medium text-white">Simulating Transaction</h3>
            <p className="text-brand-muted text-xs">
              Verifying safety constraints...
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-0">
          <div className="flex justify-between border-b border-white/5 py-2.5">
            <span className="text-brand-muted text-sm">Send</span>
            <span className="text-sm font-medium text-white">
              {intent.sell?.amount} {fromToken}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 py-2.5">
            <span className="text-brand-muted text-sm">Receive (est.)</span>
            <span className="text-sm font-medium text-white">
              ~{quote.expectedOut} {toToken}
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 py-2.5">
            <span className="text-brand-muted text-sm">Price Impact</span>
            <span className="text-sm font-medium text-green-400">
              {(quote.priceImpactBps / 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-brand-muted text-sm">Risk Level</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
              <span className="size-1.5 rounded-full bg-green-400" />
              Low
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2">
          <span className="border-brand-accent size-4 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-brand-muted text-sm">
            Simulation in progress...
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
