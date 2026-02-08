"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-brand-accent" : "bg-white/10",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [slippage, setSlippage] = useState("0.5");
  const [speed, setSpeed] = useState<"normal" | "fast" | "instant">("normal");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [autoArchive, setAutoArchive] = useState(true);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-brand-muted text-sm">
            Configure your trading preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6"
          >
            <h3 className="text-white font-medium mb-1">
              Slippage Tolerance
            </h3>
            <p className="text-brand-muted text-xs mb-4">
              Maximum acceptable price difference
            </p>
            <div className="flex gap-2">
              {["0.1", "0.5", "1.0"].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippage(val)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    slippage === val
                      ? "bg-brand-accent text-white"
                      : "bg-white/5 text-brand-muted hover:bg-white/10",
                  )}
                >
                  {val}%
                </button>
              ))}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-accent/30 transition-colors"
                  placeholder="Custom"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">
                  %
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6"
          >
            <h3 className="text-white font-medium mb-1">Transaction Speed</h3>
            <p className="text-brand-muted text-xs mb-4">
              Gas price preference for execution
            </p>
            <div className="flex gap-2">
              {(
                [
                  { value: "normal", label: "Normal", desc: "Standard gas" },
                  { value: "fast", label: "Fast", desc: "1.5x gas" },
                  { value: "instant", label: "Instant", desc: "2x gas" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSpeed(opt.value)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-center transition-all",
                    speed === opt.value
                      ? "bg-brand-accent/10 border border-brand-accent/30 text-white"
                      : "bg-white/5 border border-transparent text-brand-muted hover:bg-white/10",
                  )}
                >
                  <span className="text-sm font-medium block">{opt.label}</span>
                  <span className="text-[10px] text-brand-muted block mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6"
          >
            <h3 className="text-white font-medium mb-4">Privacy & Storage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm">Encrypt Receipts</p>
                  <p className="text-brand-muted text-xs">
                    Use Seal encryption for trade receipts
                  </p>
                </div>
                <ToggleSwitch checked={privacyMode} onChange={setPrivacyMode} />
              </div>
              <div className="border-t border-white/5" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm">Auto-Archive to Walrus</p>
                  <p className="text-brand-muted text-xs">
                    Automatically store receipts on Walrus
                  </p>
                </div>
                <ToggleSwitch checked={autoArchive} onChange={setAutoArchive} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6"
          >
            <h3 className="text-white font-medium mb-1">AI Preferences</h3>
            <p className="text-brand-muted text-xs mb-4">
              Customize AI copilot behavior
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">
                  Default Trade Size
                </label>
                <input
                  type="text"
                  placeholder="e.g., 50 SUI"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none focus:border-brand-accent/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-white text-sm block mb-2">
                  Preferred Token Pair
                </label>
                <input
                  type="text"
                  placeholder="e.g., SUI/USDC"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none focus:border-brand-accent/30 transition-colors"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button className="w-full bg-brand-accent hover:bg-[#4DA3FF] text-white rounded-xl h-12 font-medium">
              Save Preferences
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
