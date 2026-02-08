import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { WhyChoose } from "@/components/landing/why-choose";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-brand-accent/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <WhyChoose />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
