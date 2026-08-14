import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ArchitectureDiagram } from "@/components/landing/ArchitectureDiagram";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-base-950">
      <LandingNav />
      <Hero />
      <Features />

      <section id="necə-işləyir" className="border-t border-base-700 bg-base-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
              Necə işləyir?
            </h2>
            <p className="mt-3 text-ink-300">
              Hazırda real sensor qoşulmayıb — bütün məlumatlar realistik
              simulyator tərəfindən yaradılır. Arxitektura isə real IoT
              cihazları üçün əvvəlcədən hazırlanıb: gələcəkdə sadəcə
              simulyator real API ilə əvəz olunacaq, dashboard dəyişməyəcək.
            </p>
          </div>

          <div className="mt-12">
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
