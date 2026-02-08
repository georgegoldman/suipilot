"use client";

import { Logo } from "./icons";
import { Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-16 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16"
        >
          <motion.div variants={ITEM_VARIANTS} className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo className="size-6 text-white" />
              <span className="text-white font-bold tracking-tight">
                SuiCopilot
              </span>
            </div>
            <p className="text-brand-muted text-xs leading-relaxed max-w-xs mb-8">
              Trade with natural language. Execute with precision &mdash;
              privately and safely. AI-powered intent trading on Sui with
              DeepBook, Seal encryption, and Walrus storage.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-brand-muted hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-brand-muted hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-brand-muted hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={ITEM_VARIANTS}>
            <h4 className="text-white font-semibold mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-xs text-brand-muted">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  DeepBook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Updates
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={ITEM_VARIANTS}>
            <h4 className="text-white font-semibold mb-6 text-sm">
              Ecosystem
            </h4>
            <ul className="space-y-4 text-xs text-brand-muted">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sui Network
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  DeepBook Protocol
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Walrus Storage
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Seal Encryption
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sui Intents
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={ITEM_VARIANTS}>
            <h4 className="text-white font-semibold mb-6 text-sm">
              Resources
            </h4>
            <ul className="space-y-4 text-xs text-brand-muted">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
