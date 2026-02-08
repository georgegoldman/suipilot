"use client";

import { motion } from "framer-motion";

export function WalletOverlay() {
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
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="size-16 rounded-2xl bg-[#0F0F0F] border border-white/[0.06] flex items-center justify-center mx-auto mb-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A8DFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">
          Waiting for Wallet
        </h3>
        <p className="text-brand-muted text-sm">
          Please confirm the transaction in your wallet...
        </p>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:0ms]" />
          <span className="size-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:150ms]" />
          <span className="size-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:300ms]" />
        </div>
      </motion.div>
    </motion.div>
  );
}
