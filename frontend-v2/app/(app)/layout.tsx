import { AppNavbar } from "@/components/app/app-navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-brand-accent/30 selection:text-white">
      <AppNavbar />
      {children}
    </div>
  );
}
