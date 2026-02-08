"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/landing/icons";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Trade", href: "/trade" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
      <header className="w-full max-w-[900px] bg-[#0F0F0F]/80 backdrop-blur-2xl border border-white/[0.06] rounded-full py-2 pl-4 md:pl-6 pr-2 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />

        <Link href="/" className="flex items-center gap-2 shrink-0 pl-1">
          <Logo className="size-5 text-brand-accent" />
          <span className="text-white font-medium text-lg tracking-tight">
            SuiCopilot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-[#999] hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="bg-brand-accent hover:bg-[#4DA3FF] text-white rounded-full px-5 h-[38px] text-sm font-medium transition-all active:scale-95 flex items-center gap-2">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" />
          <span className="hidden sm:inline">0x1a...3f4d</span>
          <span className="sm:hidden">Connected</span>
        </button>
      </header>
    </div>
  );
}
