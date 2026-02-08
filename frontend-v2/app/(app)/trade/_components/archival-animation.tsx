"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Securing Trade Receipt...", delay: 0 },
  { label: "Encrypting with Seal...", delay: 800 },
  { label: "Uploading to Walrus Storage...", delay: 1600 },
];

export function ArchivalAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i), step.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.5 }}
          className="size-16 rounded-2xl bg-[#0F0F0F] border border-brand-accent/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(42,141,255,0.1)]"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A8DFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </motion.div>

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= activeStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: step.delay / 1000, duration: 0.3 }}
              className="flex items-center gap-3 justify-center"
            >
              {i < activeStep ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : i === activeStep ? (
                <span className="size-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="size-4 rounded-full border border-white/10" />
              )}
              <span
                className={cn(
                  "text-sm",
                  i <= activeStep ? "text-white" : "text-brand-muted",
                )}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
