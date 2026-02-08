"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function Star({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
    </svg>
  );
}

function CurvedGrid() {
  return (
    <svg
      className="absolute inset-0 size-full pointer-events-none opacity-20"
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M-100 200 Q 720 500 1540 200" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M-100 400 Q 720 700 1540 400" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M-100 600 Q 720 900 1540 600" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
      <path d="M200 -100 Q 400 450 200 1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
      <path d="M400 -100 Q 550 450 400 1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
      <path d="M1240 -100 Q 1040 450 1240 1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
      <path d="M1040 -100 Q 890 450 1040 1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
      <path d="M720 -100 L 720 1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-24 overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute inset-0 bg-[#050505]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-20%] left-[-10%] size-[800px] bg-brand-accent blur-[120px] rounded-full pointer-events-none mix-blend-screen"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-[-10%] right-[-5%] size-[600px] bg-brand-accent blur-[100px] rounded-full pointer-events-none mix-blend-screen"
      />

      <CurvedGrid />

      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.07] pointer-events-none" />

      <Star className="absolute top-[25%] left-[10%] opacity-60 animate-pulse" size={20} />
      <Star className="absolute top-[15%] right-[20%] opacity-40" size={12} />
      <Star className="absolute bottom-[30%] left-[15%] opacity-30" size={16} />
      <Star className="absolute bottom-[20%] right-[10%] opacity-50 animate-pulse delay-700" size={24} />
      <Star className="absolute top-[40%] left-[5%] opacity-20" size={10} />
      <Star className="absolute top-[60%] right-[25%] opacity-20" size={14} />

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 inline-flex items-center p-1 pr-4 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full mr-3 tracking-wide">
            LIVE ON TESTNET
          </span>
          <span className="text-gray-400 text-xs tracking-wide">
            Powered by Sui DeepBook
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium text-white tracking-tight leading-[1.05] mb-8"
        >
          Trade with Natural Language,
          <br />
          <span className="text-white">Execute with Precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Express your trading goals in plain English. Our AI copilot parses
          your intent, enforces safety constraints, and executes on DeepBook
          &mdash; privately and verifiably.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-[500px] mx-auto mb-6"
        >
          <div className="relative w-full flex items-center bg-[#1A1A1A] rounded-full p-1.5 border border-white/5 shadow-2xl">
            <input
              type="text"
              placeholder="Try: Swap 100 USDC for SUI..."
              className="flex-1 bg-transparent border-none outline-none px-6 text-white placeholder-gray-500 text-base h-12"
            />
            <Button className="bg-brand-accent hover:bg-[#4DA3FF] text-white px-8 h-12 rounded-full font-medium text-sm transition-transform active:scale-95 shadow-none border-none">
              Try Now
            </Button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-gray-600 text-xs"
        >
          Your strategy stays private with{" "}
          <a
            href="#privacy"
            className="underline decoration-gray-600 underline-offset-2 hover:text-gray-400 transition-colors"
          >
            Seal encryption
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
