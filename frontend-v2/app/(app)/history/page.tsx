"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, Unlock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_RECEIPTS = [
  {
    id: "1",
    action: "Swap",
    fromToken: "SUI",
    fromAmount: "50",
    toToken: "USDC",
    toAmount: "45.20",
    date: "Feb 5, 2026",
    status: "confirmed" as const,
    txDigest: "0x8a9f...3b2c",
    gasUsed: "0.018 SUI",
    slippage: "0.12%",
    route: "DeepBook SUI/USDC",
  },
  {
    id: "2",
    action: "Swap",
    fromToken: "USDC",
    fromAmount: "100",
    toToken: "SUI",
    toAmount: "108.50",
    date: "Feb 4, 2026",
    status: "confirmed" as const,
    txDigest: "0x7d3e...1a4f",
    gasUsed: "0.021 SUI",
    slippage: "0.08%",
    route: "DeepBook USDC/SUI",
  },
  {
    id: "3",
    action: "Swap",
    fromToken: "SUI",
    fromAmount: "25",
    toToken: "USDC",
    toAmount: "22.60",
    date: "Feb 3, 2026",
    status: "confirmed" as const,
    txDigest: "0x5c2b...9e8d",
    gasUsed: "0.015 SUI",
    slippage: "0.05%",
    route: "DeepBook SUI/USDC",
  },
  {
    id: "4",
    action: "Swap",
    fromToken: "SUI",
    fromAmount: "200",
    toToken: "USDC",
    toAmount: "181.40",
    date: "Feb 2, 2026",
    status: "confirmed" as const,
    txDigest: "0x2f1a...7c5e",
    gasUsed: "0.024 SUI",
    slippage: "0.22%",
    route: "DeepBook SUI/USDC",
  },
];

type Receipt = (typeof MOCK_RECEIPTS)[number];

export default function HistoryPage() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(
    new Set(["3", "4"]),
  );
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  function toggleLock(id: string) {
    setUnlockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredReceipts = MOCK_RECEIPTS.filter((r) =>
    searchQuery
      ? r.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.toToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.action.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-2">
            Your Trade Vault
          </h1>
          <p className="text-brand-muted text-sm">
            Encrypted receipts stored on Walrus
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search by token, action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-brand-accent/30 transition-colors"
            />
          </div>
        </motion.div>

        <div className="space-y-3">
          {filteredReceipts.map((receipt, i) => {
            const isUnlocked = unlockedIds.has(receipt.id);
            return (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group transition-colors hover:border-white/[0.1]">
                  {!isUnlocked && (
                    <div
                      className="absolute inset-0 bg-[#0F0F0F]/60 backdrop-blur-sm z-10 flex items-center justify-center cursor-pointer rounded-2xl"
                      onClick={() => toggleLock(receipt.id)}
                    >
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <Lock className="size-5 text-brand-accent mx-auto mb-2" />
                        <p className="text-brand-muted text-xs">
                          Click to decrypt
                        </p>
                      </motion.div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2A8DFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 3l4 4-4 4" />
                          <path d="M20 7H4" />
                          <path d="M8 21l-4-4 4-4" />
                          <path d="M4 17h16" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {receipt.action} {receipt.fromAmount}{" "}
                          {receipt.fromToken} &rarr; {receipt.toAmount}{" "}
                          {receipt.toToken}
                        </p>
                        <p className="text-brand-muted text-xs mt-0.5">
                          {receipt.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {receipt.status}
                      </Badge>
                      {isUnlocked && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLock(receipt.id)}
                            className="text-brand-muted hover:text-white transition-colors"
                          >
                            <Unlock className="size-4" />
                          </button>
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="text-brand-muted hover:text-white transition-colors"
                          >
                            <ExternalLink className="size-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredReceipts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-muted text-sm">No receipts found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6 max-w-md w-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-medium">Trade Receipt</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-brand-muted hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-0">
                {[
                  { label: "Action", value: selectedReceipt.action },
                  {
                    label: "From",
                    value: `${selectedReceipt.fromAmount} ${selectedReceipt.fromToken}`,
                  },
                  {
                    label: "To",
                    value: `${selectedReceipt.toAmount} ${selectedReceipt.toToken}`,
                  },
                  { label: "Slippage", value: selectedReceipt.slippage },
                  { label: "Gas Used", value: selectedReceipt.gasUsed },
                  { label: "Route", value: selectedReceipt.route },
                  { label: "Date", value: selectedReceipt.date },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-2.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-brand-muted text-sm">
                      {row.label}
                    </span>
                    <span className="text-white text-sm">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2.5 border-b border-white/5">
                  <span className="text-brand-muted text-sm">Tx Hash</span>
                  <span className="text-brand-accent text-sm font-mono">
                    {selectedReceipt.txDigest}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-brand-muted text-sm">Storage</span>
                  <span className="text-brand-muted text-sm flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-green-400" />
                    Walrus
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5"
                  onClick={() => setSelectedReceipt(null)}
                >
                  Close
                </Button>
                <Button className="flex-1 rounded-xl bg-brand-accent hover:bg-[#4DA3FF] text-white">
                  View on Explorer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
