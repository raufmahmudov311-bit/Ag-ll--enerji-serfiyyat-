"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartRange } from "@/types/energy";
import { fetchHistoricalSeries } from "@/services/energy-api";
import { cx, formatClock, formatDay } from "@/lib/utils";

const RANGE_LABELS: Record<ChartRange, string> = {
  "24h": "24 saat",
  "7d": "7 gün",
  "30d": "30 gün",
};

interface EnergyChartProps {
  deviceId: string;
  metric: "voltage" | "current" | "power" | "energy" | "leakage";
  title: string;
  unit: string;
  color: string;
  ranges?: ChartRange[];
}

export function EnergyChart({
  deviceId,
  metric,
  title,
  unit,
  color,
  ranges = ["24h", "7d", "30d"],
}: EnergyChartProps) {
  const [range, setRange] = useState<ChartRange>(ranges[0]);
  const [data, setData] = useState<{ timestamp: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHistoricalSeries(deviceId, metric, range).then((series) => {
      if (!cancelled) {
        setData(series);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [deviceId, metric, range]);

  const gradientId = `grad-${metric}`;

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/70 p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-ink-100">{title}</h3>
        <div className="flex gap-1 rounded-lg border border-base-700 bg-base-850 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cx(
                "rounded-md px-2.5 py-1 text-xs font-medium transition",
                range === r ? "bg-volt-500 text-base-950" : "text-ink-300 hover:text-ink-100"
              )}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-56">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-500">Yüklənir...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1B2A44" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(v) => (range === "24h" ? formatClock(v) : formatDay(v))}
                tick={{ fill: "#7A8BAC", fontSize: 11 }}
                axisLine={{ stroke: "#1B2A44" }}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                tick={{ fill: "#7A8BAC", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "#0F1A2B",
                  border: "1px solid #28395A",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(v) => (range === "24h" ? formatClock(v as string) : formatDay(v as string))}
                formatter={(value: number) => [`${value} ${unit}`, title]}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
