"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectWalletCard } from "@/components/app/connect-wallet";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { deepbook } from "@mysten/deepbook-v3";

export default function TradeAppPage() {
  const [intent, setIntent] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [useBackend, setUseBackend] = useState(true);

  const account = useCurrentAccount();
  const dAppKit = useDAppKit();

  // Parse intent using frontend Gemini AI
  const handleParseIntentFrontend = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!intent.trim()) {
      setError("Please enter a trading intent");
      return;
    }

    setIsParsing(true);
    setError(null);
    setQuote(null);

    try {
      const { parseIntentWithGemini } = await import("@/lib/gemini");
      const parsedQuote = await parseIntentWithGemini(intent, account.address);
      setQuote(parsedQuote);
    } catch (err) {
      console.error("AI Parsing failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to parse intent with AI. Please try again.",
      );
    } finally {
      setIsParsing(false);
    }
  };

  // Parse intent using backend API
  const handleParseIntentBackend = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!intent.trim()) {
      setError("Please enter a trading intent");
      return;
    }

    setIsParsing(true);
    setError(null);
    setQuote(null);

    try {
      const response = await fetch("http://localhost:8787/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: intent,
          sender: account.address,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      console.error("Backend parsing failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to parse intent. Make sure your backend is running.",
      );
    } finally {
      setIsParsing(false);
    }
  };

  // Execute trade on DeepBook
  const handleExecute = async () => {
    if (!quote || !account) return;

    setIsExecuting(true);
    setError(null);

    try {
      console.log("📦 Quote data:", quote);

      const tx = new Transaction();

      // Get the client and extend with DeepBook
      const client = dAppKit.getClient();
      console.log("🔌 Client:", client);

      if (!client) {
        throw new Error("Client not initialized");
      }

      // Check if client has $extend method
      if (typeof client.$extend !== "function") {
        throw new Error("Client does not support $extend");
      }

      const dbClient = client.$extend(deepbook());
      console.log("📚 DeepBook Client:", dbClient);

      // Validate quote data
      if (!quote.poolKey || !quote.amount || !quote.side) {
        throw new Error("Invalid quote data");
      }

      const swapParams = {
        poolKey: quote.poolKey,
        amount: quote.amount,
        deepAmount: 1,
        minOut: quote.minOut || 0,
      };

      console.log("🔄 Swap params:", swapParams);

      // Execute swap based on side
      const [baseOut, quoteOut, deepOut] =
        quote.side === "SELL_BASE"
          ? dbClient.deepbook.swapExactBaseForQuote({ params: swapParams })(tx)
          : dbClient.deepbook.swapExactQuoteForBase({ params: swapParams })(tx);

      // Transfer resulting coins back to user
      tx.transferObjects([baseOut, quoteOut, deepOut], account.address);

      console.log("✍️ Signing transaction...");

      // Sign and execute transaction
      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("✅ Trade Successful!", result.digest);
      alert(`Trade executed successfully!\n\nTransaction: ${result.digest}`);

      setIntent("");
      setQuote(null);
    } catch (err) {
      console.error("❌ Trade Failed:", err);
      setError(err instanceof Error ? err.message : "Failed to execute trade");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleParseIntent = useBackend
    ? handleParseIntentBackend
    : handleParseIntentFrontend;

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Sui Copilot</h1>
        <p className="text-muted-foreground text-sm">
          Natural Language → DeepBook Execution
        </p>
      </div>

      <ConnectWalletCard />

      {/* Intent Input */}
      <Card>
        <CardHeader>
          <CardTitle>What would you like to trade?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Mode Toggle */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">AI Mode:</span>
            <Button
              variant={useBackend ? "outline" : "default"}
              size="sm"
              onClick={() => setUseBackend(false)}
            >
              🤖 Frontend (Gemini)
            </Button>
            <Button
              variant={useBackend ? "default" : "outline"}
              size="sm"
              onClick={() => setUseBackend(true)}
            >
              🔌 Backend API
            </Button>
          </div>

          <Textarea
            placeholder="e.g., Swap 50 SUI for USDC with 0.5% slippage"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="min-h-[100px]"
            disabled={isParsing || isExecuting}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleParseIntent}
            disabled={isParsing || isExecuting || !intent.trim() || !account}
          >
            {isParsing
              ? "🤖 AI Analyzing..."
              : `Generate Quote ${useBackend ? "(Backend)" : "(Gemini)"}`}
          </Button>
        </CardContent>
      </Card>

      {/* Quote Review & Execute */}
      {quote && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>Review Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Action:</span>
                <span className="font-mono font-semibold">{quote.action}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Pool:</span>
                <span className="font-mono">{quote.poolKey}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-mono">{quote.amount}</span>
              </div>

              {quote.expectedOutput && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Expected Output:
                  </span>
                  <span className="font-mono font-bold text-green-600">
                    {quote.expectedOutput}
                  </span>
                </div>
              )}

              {quote.minOut !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Output:</span>
                  <span className="font-mono">{quote.minOut}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Side:</span>
                <span className="font-mono">{quote.side}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <Button
                className="w-full"
                onClick={handleExecute}
                disabled={isExecuting}
              >
                {isExecuting ? "⏳ Executing..." : "✓ Confirm & Execute"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
