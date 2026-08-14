"use client";

import { useEffect, useRef, useState } from "react";
import { EnergyReading, LiveSnapshot } from "@/types/energy";
import { fetchLatestReading } from "@/services/energy-api";
import { calculateCost, leakageStatus, voltageStatus } from "@/lib/utils";

const POLL_INTERVAL_MS = 3000;

export function useEnergyData(deviceId: string) {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [history, setHistory] = useState<EnergyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const startEnergyRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    startEnergyRef.current = null;

    async function poll() {
      try {
        const reading = await fetchLatestReading(deviceId);
        if (cancelled) return;

        if (startEnergyRef.current === null) {
          startEnergyRef.current = reading.energy;
        }

        const next: LiveSnapshot = {
          reading,
          voltageStatus: voltageStatus(reading.voltage),
          leakageStatus: leakageStatus(reading.leakage),
          systemStatus: "online",
          estimatedCostToday: calculateCost(
            Math.max(0, reading.energy - (startEnergyRef.current ?? reading.energy))
          ),
        };

        setSnapshot(next);
        setHistory((prev) => [...prev.slice(-59), reading]);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setSnapshot((prev) =>
            prev ? { ...prev, systemStatus: "offline" } : prev
          );
          setLoading(false);
        }
      }
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [deviceId]);

  return { snapshot, history, loading };
}
