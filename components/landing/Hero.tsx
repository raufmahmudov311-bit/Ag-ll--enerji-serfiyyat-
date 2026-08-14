"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, Zap } from "lucide-react";
import { useEnergyData } from "@/hooks/useEnergyData";
import { formatCurrent, formatPower, formatVoltage } from "@/lib/utils";

export function Hero() {
  const { snapshot } = useEnergyData("DEVICE-001");

  return (
    <section className="relative overflow-hidden border-b border-base-700">
      <div aria-hidden className="absolute inset-0 bg-noise-grid" />
      <div aria-hidden className="absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-volt-500/10 blur-[110px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-20 pt-16 sm:pt-24 lg:flex-row lg:items-center lg:gap-10 lg:pb-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-base-600 bg-base-900/80 px-3 py-1 text-xs font-medium text-volt-400">
            <Zap size={13} strokeWidth={2.25} />
            Smart Energy Monitoring
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-ink-100 sm:text-5xl">
            Evinizin enerjisini ağıllı şəkildə izləyin
          </h1>

          <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
            Gərginlik, cərəyan, enerji sərfiyyatı, elektrik xərcləri və
            təhlükəsizlik göstəricilərini bir platformadan izləyin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-volt-500 px-5 py-3 text-sm font-semibold text-base-950 transition hover:bg-volt-400"
            >
              Platformanı yoxla
              <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
            <a
              href="#necə-işləyir"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-base-600 bg-base-900/60 px-5 py-3 text-sm font-semibold text-ink-100 transition hover:border-base-600 hover:bg-base-850"
            >
              <PlayCircle size={16} strokeWidth={2.25} />
              Necə işləyir?
            </a>
          </div>

          <p className="mt-5 text-xs text-ink-500">
            Hazırda nümayiş rejimindədir — real sensor məlumatları simulyasiya
            olunur.
          </p>
        </div>

        <div className="w-full max-w-sm lg:ml-auto">
          <div className="rounded-2xl border border-base-600 bg-base-900/80 p-5 shadow-card backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                Mənim evim · canlı
              </p>
              <span className="flex items-center gap-1.5 text-xs font-medium text-volt-400">
                <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-volt-500" />
                Onlayn
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Gərginlik" value={snapshot ? formatVoltage(snapshot.reading.voltage) : "—"} />
              <MiniStat label="Cərəyan" value={snapshot ? formatCurrent(snapshot.reading.current) : "—"} />
              <MiniStat label="Güc" value={snapshot ? formatPower(snapshot.reading.power) : "—"} />
              <MiniStat
                label="Sızma"
                value={snapshot ? `${snapshot.reading.leakage.toFixed(1)} mA` : "—"}
                warn={snapshot?.leakageStatus === "detected"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-base-700 bg-base-850/80 px-3.5 py-3">
      <p className="text-[11px] text-ink-500">{label}</p>
      <p className={`mt-1 font-tabular text-lg font-medium ${warn ? "text-danger-400" : "text-ink-100"}`}>
        {value}
      </p>
    </div>
  );
}
