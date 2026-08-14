"use client";

import { useEffect, useRef, useState } from "react";
import { EnergyAlert, LiveSnapshot } from "@/types/energy";

const MAX_ALERTS = 30;

function makeAlert(
  partial: Omit<EnergyAlert, "alertId" | "status" | "timestamp">
): EnergyAlert {
  return {
    ...partial,
    alertId: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "active",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Watches a live snapshot and raises an alert the moment a condition
 * transitions from normal -> abnormal, instead of spamming one alert per
 * poll while a condition stays abnormal.
 */
export function useAlerts(homeId: string, deviceId: string, snapshot: LiveSnapshot | null) {
  const [alerts, setAlerts] = useState<EnergyAlert[]>([]);
  const wasVoltageAbnormal = useRef(false);
  const wasLeakageAbnormal = useRef(false);

  useEffect(() => {
    if (!snapshot) return;

    const newAlerts: EnergyAlert[] = [];

    const voltageAbnormal = snapshot.voltageStatus !== "normal";
    if (voltageAbnormal && !wasVoltageAbnormal.current) {
      newAlerts.push(
        makeAlert({
          homeId,
          deviceId,
          type: snapshot.voltageStatus === "high" ? "voltage_high" : "voltage_low",
          value: snapshot.reading.voltage,
          severity: "warning",
          message:
            snapshot.voltageStatus === "high"
              ? "Gərginlik normadan yüksəkdir."
              : "Gərginlik normadan aşağıdır.",
        })
      );
    }
    wasVoltageAbnormal.current = voltageAbnormal;

    const leakageAbnormal = snapshot.leakageStatus === "detected";
    if (leakageAbnormal && !wasLeakageAbnormal.current) {
      newAlerts.push(
        makeAlert({
          homeId,
          deviceId,
          type: "leakage_detected",
          value: snapshot.reading.leakage,
          severity: "critical",
          message: "Elektrik sızması aşkarlanıb. Elektrik sistemini yoxlatdırın.",
        })
      );
    }
    wasLeakageAbnormal.current = leakageAbnormal;

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, MAX_ALERTS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot?.reading.timestamp]);

  function resolveAlert(alertId: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.alertId === alertId ? { ...a, status: "resolved" } : a))
    );
  }

  return { alerts, resolveAlert };
}
