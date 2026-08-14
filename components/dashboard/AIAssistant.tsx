"use client";

import { useMemo } from "react";
import { Bot, Sparkles } from "lucide-react";
import { EnergyReading } from "@/types/energy";

interface AIAssistantProps {
  history: EnergyReading[];
}

/**
 * Demo AI Energy Assistant.
 *
 * Generates plain-language insights from recent readings using simple
 * rule-based statistics — no external AI API call is made. The structure
 * (a single `buildInsights` function returning strings) is deliberately the
 * seam where a real AI provider would plug in later: swap the body for a
 * call to services/ai-assistant.ts -> an LLM API, keep the same component
 * contract. See AI_PROVIDER_API_KEY in .env.example.
 */
function buildInsights(history: EnergyReading[]): string[] {
  if (history.length < 5) {
    return ["Analiz üçün kifayət qədər məlumat toplanır. Bir neçə an gözləyin..."];
  }

  const insights: string[] = [];
  const recent = history.slice(-20);
  const first = recent[0];
  const last = recent[recent.length - 1];

  const energyDelta = last.energy - first.energy;
  if (energyDelta > 0.01) {
    const perMinute = energyDelta / (recent.length / 20);
    insights.push(
      `Son ölçmələrə əsasən enerji sərfiyyatınız davamlı artır (~${(perMinute * 60).toFixed(
        2
      )} kWh/saat sürətlə).`
    );
  } else {
    insights.push("Son ölçmələrdə enerji sərfiyyatınız sabit səviyyədədir.");
  }

  const avgVoltage = recent.reduce((sum, r) => sum + r.voltage, 0) / recent.length;
  const voltageDeviation = recent.some((r) => r.voltage > 240 || r.voltage < 220);
  if (voltageDeviation) {
    insights.push("Gərginlikdə son ölçmələr ərzində normadan kənar dəyişiklik müşahidə olunub.");
  } else {
    insights.push(`Gərginlik sabit qalır, orta göstərici ${avgVoltage.toFixed(1)} V təşkil edir.`);
  }

  const avgPower = recent.reduce((sum, r) => sum + r.power, 0) / recent.length;
  const currentHour = new Date().getHours();
  if (currentHour >= 19 && currentHour <= 22) {
    insights.push("Hazırda axşam pik saatlarındasınız — ən yüksək sərfiyyat adətən 19:00–22:00 arasında müşahidə olunur.");
  } else if (avgPower > 1200) {
    insights.push(`Cari orta güc ${(avgPower / 1000).toFixed(2)} kW səviyyəsindədir, bu adi məişət istifadəsindən yüksəkdir.`);
  }

  const leakageEvents = recent.filter((r) => r.leakage >= 10).length;
  if (leakageEvents > 0) {
    insights.push("Son ölçmələrdə elektrik sızması hadisələri qeydə alınıb — Elektrik sızması kartını yoxlayın.");
  }

  return insights.slice(0, 4);
}

export function AIAssistant({ history }: AIAssistantProps) {
  const insights = useMemo(() => buildInsights(history), [history]);

  return (
    <div className="rounded-2xl border border-base-700 bg-gradient-to-br from-base-900/80 to-base-850/60 p-5 shadow-card">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt-500/10 text-volt-400">
          <Bot size={17} strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="font-display text-sm font-semibold text-ink-100">AI Enerji Köməkçisi</h3>
          <p className="text-xs text-ink-500">Demo analiz — canlı məlumatlara əsaslanır</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2.5 rounded-xl border border-base-700 bg-base-900/60 px-3.5 py-3">
            <Sparkles size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-volt-400" />
            <p className="text-sm leading-relaxed text-ink-200">{insight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
