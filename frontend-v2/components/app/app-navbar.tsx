"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/landing/icons";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const NAV_LINKS = [
  { label: "Trade", href: "/trade" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

const ConnectButton = dynamic(
  () =>
    import("../../app/(app)/DAppKitClientProvider").then(
      (mod) => mod.ConnectButton,
    ),
  { ssr: false, loading: () => <button disabled>Loading...</button> },
);

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
      <header className="relative flex w-full max-w-[900px] items-center justify-between rounded-full border border-white/[0.06] bg-[#0F0F0F]/80 py-2 pr-2 pl-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:pl-6">
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

        <Link href="/" className="flex shrink-0 items-center gap-2 pl-1">
          <Logo className="text-brand-accent size-5" />
          <span className="text-lg font-medium tracking-tight text-white">
            SuiCopilot
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-[#999] hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <ConnectButton className="bg-brand-accent flex h-[38px] items-center gap-2 rounded-full px-5 text-sm font-medium text-white transition-all hover:bg-[#4DA3FF] active:scale-95">
          <span className="size-2 animate-pulse rounded-full bg-green-400" />
          <span className="sm:hidden">Connected</span>
        </ConnectButton>
      </header>
    </div>
  );
}
