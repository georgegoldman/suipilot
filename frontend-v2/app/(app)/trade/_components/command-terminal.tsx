"use client";

import { useState } from "react";
import { parseIntent } from "@/lib/api";
import type { IntentSpec } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommandTerminalProps {
  onIntentParsed: (intent: IntentSpec) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const SUGGESTION_CHIPS = [
  "Swap 50 SUI for USDC",
  "Buy 100 USDC with SUI",
  "Sell 25 SUI for USDC",
];

export function CommandTerminal({
  onIntentParsed,
  onError,
  disabled,
}: CommandTerminalProps) {
  const [prompt, setPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  async function handleSubmit() {
    if (!prompt.trim() || isParsing || disabled) return;

    setIsParsing(true);
    try {
      const intent = await parseIntent(prompt);
      onIntentParsed(intent);
      setPrompt("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to parse intent");
    } finally {
      setIsParsing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative bg-[#0F0F0F] rounded-2xl border border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)] overflow-hidden">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your trade command... (e.g., Swap 50 SUI for USDC)"
          disabled={disabled || isParsing}
          rows={3}
          className={cn(
            "w-full bg-transparent text-white placeholder-[#555] text-sm resize-none outline-none p-4 pb-12",
            (disabled || isParsing) && "opacity-50 cursor-not-allowed",
          )}
        />
        <div className="absolute bottom-3 right-3">
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isParsing || disabled}
            className={cn(
              "size-8 rounded-lg flex items-center justify-center transition-all",
              prompt.trim() && !isParsing && !disabled
                ? "bg-brand-accent hover:bg-[#4DA3FF] text-white"
                : "bg-white/5 text-[#555]",
            )}
          >
            {isParsing ? (
              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {SUGGESTION_CHIPS.map((chip) => (
          <Badge
            key={chip}
            variant="outline"
            className="cursor-pointer hover:bg-white/5 hover:border-white/20 transition-colors text-[#888]"
            onClick={() => !disabled && !isParsing && setPrompt(chip)}
          >
            {chip}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-[#555] text-center">
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-[#888] border border-white/10">
          ⌘
        </kbd>{" "}
        +{" "}
        <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-[#888] border border-white/10">
          Enter
        </kbd>{" "}
        to submit
      </p>
    </div>
  );
}
