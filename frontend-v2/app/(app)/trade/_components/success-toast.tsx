"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessToastProps {
  onDismiss: () => void;
}

export function SuccessToast({ onDismiss }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 100 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-8 right-8 z-[60] max-w-md"
      >
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] p-4 flex items-start gap-3">
          <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm mb-0.5">
              Trade executed!
            </h4>
            <p className="text-xs text-brand-muted">
              Receipt archived to Walrus.{" "}
              <a
                href="/history"
                className="text-brand-accent hover:underline"
              >
                View History
              </a>
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="text-brand-muted hover:text-white transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
