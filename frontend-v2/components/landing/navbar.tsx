"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./icons";

const NAV_LINKS = ["Home", "How It Works", "Features", "Privacy", "FAQ"];

export function Navbar() {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 px-4 flex justify-center">
      <header className="w-full max-w-[1150px] bg-[#0F0F0F]/80 backdrop-blur-2xl border border-white/[0.06] rounded-full py-2 pl-4 md:pl-6 pr-2 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />

        <div className="flex items-center gap-2 md:gap-3 w-auto md:w-[200px] pl-2 shrink-0">
          <Logo className="size-5 text-brand-accent" />
          <span className="text-white font-medium text-lg tracking-tight">
            SuiCopilot
          </span>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-10">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[15px] text-[#999] hover:text-white transition-colors font-medium tracking-wide"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex justify-end w-auto md:w-[200px] shrink-0">
          <Link href="/trade">
            <Button className="bg-brand-accent hover:bg-[#4DA3FF] text-white border-none shadow-none rounded-full px-6 md:px-8 h-[46px] text-sm md:text-[15px] font-medium transition-transform active:scale-95">
              Launch App
            </Button>
          </Link>
        </div>
      </header>
    </div>
  );
}
