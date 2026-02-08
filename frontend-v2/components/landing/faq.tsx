"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    id: 1,
    q: "What is SuiCopilot and how does it work?",
    a: "SuiCopilot is an AI-powered trading copilot on Sui. Express your trading goals in plain English, and our AI parses your intent into a strict structured format, validates safety constraints, and executes the trade on DeepBook with a verifiable execution receipt.",
  },
  {
    id: 2,
    q: "How does SuiCopilot keep my trades private?",
    a: "Your preferences, intent history, and execution logs are encrypted using Seal and stored on Walrus. No sensitive data is stored on-chain, and only you control access to your trading strategy.",
  },
  {
    id: 3,
    q: "What safety constraints does SuiCopilot enforce?",
    a: "Trades execute only if all constraints pass: maximum slippage tolerance, liquidity threshold checks, time-bound execution windows, and approved DeepBook pool verification. If any constraint fails, no transaction is sent.",
  },
  {
    id: 4,
    q: "Do I need technical knowledge to use SuiCopilot?",
    a: "No. SuiCopilot is designed for everyone. You don't need to understand order types, slippage, or gas optimization. Just express your trading goal in plain English and the copilot handles the rest.",
  },
  {
    id: 5,
    q: "What are verifiable execution receipts?",
    a: "After each trade, SuiCopilot generates a best-execution receipt including expected vs executed price, slippage in basis points, the DeepBook pool used, and the transaction digest. Receipts are stored on Walrus for independent verification.",
  },
];

function FAQItem({
  item,
  isOpen,
  onClick,
}: {
  item: (typeof FAQS)[number];
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative group mb-5 p-[1px] rounded-[25px] transition-all duration-500",
        isOpen
          ? "bg-gradient-to-r from-brand-accent via-brand-accent/40 to-brand-accent/10"
          : "bg-gradient-to-r from-brand-accent via-brand-accent/10 to-white/5",
      )}
    >
      <div className="relative bg-[#080808] rounded-[25px] overflow-hidden h-full transition-colors duration-500">
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-[150px] bg-gradient-to-r from-brand-accent/10 to-transparent pointer-events-none transition-opacity duration-500",
            isOpen ? "opacity-100" : "opacity-30 group-hover:opacity-60",
          )}
        />

        <button
          className="w-full flex items-center justify-between p-6 pl-10 pr-10 md:py-8 text-left focus:outline-none relative z-10"
          onClick={onClick}
        >
          <div className="flex items-center gap-8 md:gap-12 w-full">
            <span
              className={cn(
                "text-sm md:text-base font-normal tracking-widest transition-colors duration-300 w-6",
                isOpen
                  ? "text-white"
                  : "text-white/60 group-hover:text-white/80",
              )}
            >
              0{item.id}
            </span>
            <span
              className={cn(
                "text-base md:text-lg font-normal tracking-wide transition-colors duration-300 flex-1",
                isOpen ? "text-white" : "text-gray-300 group-hover:text-white",
              )}
            >
              {item.q}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 ml-4 transition-colors duration-300",
              isOpen ? "text-white" : "text-white/70 group-hover:text-white",
            )}
          >
            {isOpen ? (
              <Minus size={22} strokeWidth={1} />
            ) : (
              <Plus size={22} strokeWidth={1} />
            )}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="px-10 pb-8 pl-[5rem] md:pl-[6.5rem] text-gray-400 text-base leading-relaxed font-light max-w-4xl relative z-10">
                {item.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="faq" className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-[3.25rem] font-medium text-white tracking-tight leading-[1.2]">
            Frequently Asked Questions
            <br />
            (FAQ)
          </h2>
        </motion.div>

        <div className="max-w-[1200px] mx-auto flex flex-col gap-5">
          {FAQS.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
