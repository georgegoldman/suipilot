"use client";

import { motion } from "framer-motion";
import type { IntentSpec, Quote } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  intent: IntentSpec;
  quote: Quote;
  onCancel: () => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export function ReviewCard({
  intent,
  quote,
  onCancel,
  onExecute,
  isExecuting,
}: ReviewCardProps) {
  const fromToken = intent.sell.coinType.split("::").pop() || "UNKNOWN";
  const toToken = intent.buy.coinType.split("::").pop() || "UNKNOWN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Review Transaction</h3>
            <Badge variant="secondary">{intent.type}</Badge>
          </div>

          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-brand-muted">From</span>
              <span className="text-white font-medium text-sm">
                {intent.sell.amount} {fromToken}
              </span>
            </div>

            <div className="flex items-center justify-center py-3">
              <div className="size-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2A8DFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-brand-muted">To (Estimated)</span>
              <span className="text-white font-medium text-sm">
                ~{quote.expectedOut} {toToken}
              </span>
            </div>

            <div className="space-y-0 pt-2">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">
                  Slippage Tolerance
                </span>
                <span className="text-white text-sm">
                  {(quote.slippageBps / 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Price Impact</span>
                <span
                  className={
                    quote.priceImpactBps > 100
                      ? "text-destructive text-sm"
                      : "text-green-400 text-sm"
                  }
                >
                  {(quote.priceImpactBps / 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Network Fee</span>
                <span className="text-white text-sm">~0.02 SUI</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Route</span>
                <span className="text-brand-muted font-mono text-xs">
                  {quote.routePlan.market}
                </span>
              </div>
            </div>

            {quote.priceImpactBps > 100 && (
              <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">
                  High price impact detected. Consider reducing your trade size.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isExecuting}
            className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={onExecute}
            disabled={isExecuting}
            className="flex-1 rounded-xl bg-brand-accent hover:bg-[#4DA3FF] text-white"
          >
            {isExecuting ? (
              <>
                <span className="size-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                Executing...
              </>
            ) : (
              "Execute Trade"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
