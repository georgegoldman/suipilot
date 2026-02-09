"use client";

import { motion } from "framer-motion";
import type { IntentSpec, Quote } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  intent: IntentSpec;
  quote: Quote | null;
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
  const fromToken = intent.sell?.coinType?.split("::").pop() || "UNKNOWN";
  const toToken = intent.buy?.coinType?.split("::").pop() || "UNKNOWN";
  const INTENT_LABELS: Record<IntentSpec["action"], string> = {
    DEPOSIT: "Deposit",
    WITHDRAW: "Withdraw",
    SWAP_EXACT_IN: "Swap",
    PLACE_ORDER: "Place Order",
    CANCEL_ORDER: "Cancel Order",
    MODIFY_ORDER: "Modify Order",
    CLAIM_REBATES: "Claim Rebates",
    FLASH_LOAN: "Flash Loan",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-brand-card overflow-hidden rounded-2xl border border-white/6 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="p-6 pb-0">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-medium text-white">Review Transaction</h3>
            <Badge variant="secondary">{INTENT_LABELS[intent.action]}</Badge>
          </div>

          <div className="space-y-0">
            <div className="flex items-center justify-between border-b border-white/5 py-3">
              <span className="text-brand-muted text-sm">From</span>
              <span className="text-sm font-medium text-white">
                {intent.sell?.amount ?? "-"} {fromToken}
              </span>
            </div>

            <div className="flex items-center justify-center py-3">
              <div className="bg-brand-accent/10 flex size-8 items-center justify-center rounded-full">
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

            <div className="flex items-center justify-between border-b border-white/5 py-3">
              <span className="text-brand-muted text-sm">To (Estimated)</span>
              <span className="text-sm font-medium text-white">
                ~{quote?.expectedOut} {toToken}
              </span>
            </div>

            <div className="space-y-0 pt-2">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">
                  Slippage Tolerance
                </span>
                <span className="text-sm text-white">
                  {((quote?.slippageBps ?? 0) / 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Price Impact</span>
                <span
                  className={
                    (quote?.priceImpactBps ?? 0 > 100)
                      ? "text-destructive text-sm"
                      : "text-sm text-green-400"
                  }
                >
                  {((quote?.priceImpactBps ?? 0) / 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Network Fee</span>
                <span className="text-sm text-white">~0.02 SUI</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-brand-muted text-sm">Route</span>
                <span className="text-brand-muted font-mono text-xs">
                  {quote?.routePlan.market}
                </span>
              </div>
            </div>

            {quote && quote.priceImpactBps > 100 && (
              <div className="bg-destructive/10 border-destructive/20 mt-4 rounded-xl border p-3">
                <p className="text-destructive text-sm">
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
            className="bg-brand-accent flex-1 rounded-xl text-white hover:bg-[#4DA3FF]"
          >
            {isExecuting ? (
              <>
                <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
