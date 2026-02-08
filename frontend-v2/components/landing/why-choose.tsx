"use client";

import { Button } from "@/components/ui/button";
import { Shield, Layers, Zap, Trophy } from "lucide-react";
import { CardWrapper } from "./card-wrapper";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
  glowPosition,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  glowPosition: "top-right" | "top-left" | "bottom-left" | "bottom-right";
}) {
  return (
    <CardWrapper glowPosition={glowPosition} className="w-[320px]">
      <div className="p-10 h-full flex flex-col min-h-[300px]">
        <div className="size-14 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
          <Icon
            size={28}
            className="text-white group-hover:text-brand-accent transition-colors"
          />
        </div>
        <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
        <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
      </div>
    </CardWrapper>
  );
}

export function WhyChoose() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex lg:flex-row flex-col gap-20 items-center max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Why Choose
              <br />
              SuiCopilot?
            </h2>
            <div className="space-y-6 text-brand-muted text-sm md:text-base leading-relaxed max-w-md">
              <p>
                Most intent-based trading tools optimize for convenience only.
                Real trading requires privacy, safety, and verifiability &mdash;
                SuiCopilot delivers all three.
              </p>
              <p>
                Built with Sui-native primitives: DeepBook for execution, Seal
                for encryption, and Walrus for decentralized storage.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-sm border-white/20 text-white hover:bg-white/5 hover:border-white/40"
            >
              Launch App
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureCard
                icon={Shield}
                title="Private by Default"
                description="Your preferences and intent history are encrypted using Seal and stored on Walrus. Only you control access to your trading strategy."
                glowPosition="top-right"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FeatureCard
                icon={Layers}
                title="Safety-First Execution"
                description="Trades execute only if all constraints pass: max slippage, liquidity thresholds, time-bound execution. Failed constraints mean no transaction."
                glowPosition="bottom-left"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FeatureCard
                icon={Zap}
                title="Verifiable Receipts"
                description="Every trade produces a best-execution receipt stored on Walrus with expected vs actual price, slippage in bps, and transaction digest."
                glowPosition="top-right"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FeatureCard
                icon={Trophy}
                title="Natural Language Trading"
                description="No need to understand order types, slippage, or gas optimization. Just express your trading goal in plain English and let the copilot handle the rest."
                glowPosition="bottom-left"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
