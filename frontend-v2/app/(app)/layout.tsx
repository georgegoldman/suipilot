"use client";
// app/(app)/layout.tsx
import { AppNavbar } from "@/components/app/app-navbar";
import dynamic from "next/dynamic";

const DAppKitClientProvider = dynamic(
  () =>
    import("./DAppKitClientProvider").then((mod) => mod.DAppKitClientProvider),
  { ssr: false },
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DAppKitClientProvider>
      <div className="selection:bg-brand-accent/30 min-h-screen bg-[#050505] font-sans selection:text-white">
        <AppNavbar />
        {children}
      </div>
    </DAppKitClientProvider>
  );
}
