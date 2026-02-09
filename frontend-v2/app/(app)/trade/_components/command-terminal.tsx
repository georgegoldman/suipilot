"use client";
// app/trade/_components/command-terminal.tsx

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { generateDeepBookTransaction } from "../../hooks/useAiAgent"; // Import the AI Hook

import { Transaction } from "@mysten/sui/transactions";
import { IntentSpec, Quote } from "@/lib/types";
import { dAppKit } from "../../dapp-kit";

type AgentResult = {
  text: string;
  transaction: Transaction | null;
  intent: IntentSpec | null;
  quote?: Quote | null;
};

interface CommandTerminalProps {
  // Updated signature to handle both text response and transaction object
  onIntentParsed: (result: AgentResult) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const SUGGESTION_CHIPS = [
  "Swap 50 SUI for USDC",
  "Buy 100 USDC with SUI",
  "Place a limit buy order for 10 SUI at 1.5 USDC",
];

export function CommandTerminal({
  onIntentParsed,
  onError,
  disabled,
}: CommandTerminalProps) {
  const [prompt, setPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const account = dAppKit.stores.$connection.get().account;

  async function handleSubmit() {
    if (!prompt.trim() || isParsing || disabled) return;

    if (!account) {
      onError("Please connect your wallet first");
      return;
    }

    setIsParsing(true);
    try {
      // 1. Call Gemini to parse intent and generate transaction
      // Note: In a production app, you should fetch the user's real BalanceManager ID
      // from a context or on-chain query.
      const result = await generateDeepBookTransaction(
        prompt,
        account.address,
        "0xYOUR_BALANCE_MANAGER_ID", // TODO: Replace with actual fetched ID
      );

      // 2. Pass the result (text + tx) up to the parent page
      onIntentParsed(result);
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
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0F0F0F] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your trade command... (e.g., Swap 50 SUI for USDC)"
          disabled={disabled || isParsing}
          rows={3}
          className={cn(
            "w-full resize-none bg-transparent p-4 pb-12 text-sm text-white placeholder-[#555] outline-none",
            (disabled || isParsing) && "cursor-not-allowed opacity-50",
          )}
        />
        <div className="absolute right-3 bottom-3">
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isParsing || disabled}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-all",
              prompt.trim() && !isParsing && !disabled
                ? "bg-brand-accent text-white hover:bg-[#4DA3FF]"
                : "bg-white/5 text-[#555]",
            )}
          >
            {isParsing ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
            className="cursor-pointer text-[#888] transition-colors hover:border-white/20 hover:bg-white/5"
            onClick={() => !disabled && !isParsing && setPrompt(chip)}
          >
            {chip}
          </Badge>
        ))}
      </div>

      <p className="text-center text-xs text-[#555]">
        Press{" "}
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[#888]">
          ⌘
        </kbd>{" "}
        +{" "}
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[#888]">
          Enter
        </kbd>{" "}
        to submit
      </p>
    </div>
  );
}
