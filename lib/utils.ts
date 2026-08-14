import { TARIFF_CONFIG } from "@/config/tariff";
import { THRESHOLDS } from "@/config/thresholds";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value: number, digits = 1): string {
  return value.toLocaleString("az-AZ", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatVoltage(v: number): string {
  return `${formatNumber(v, 1)} V`;
}

export function formatCurrent(a: number): string {
  return `${formatNumber(a, 2)} A`;
}

export function formatPower(w: number): string {
  if (w >= 1000) return `${formatNumber(w / 1000, 2)} kW`;
  return `${formatNumber(w, 0)} W`;
}

export function formatEnergy(kwh: number): string {
  return `${formatNumber(kwh, 2)} kWh`;
}

export function formatLeakage(ma: number): string {
  return `${formatNumber(ma, 1)} mA`;
}

export function formatCost(azn: number): string {
  return `${formatNumber(azn, 2)} ${TARIFF_CONFIG.currency}`;
}

/** Power = Voltage x Current, expressed in watts. */
export function calculatePower(voltageV: number, currentA: number): number {
  return voltageV * currentA;
}

/** Cost = Energy (kWh) x tariff (AZN/kWh). */
export function calculateCost(energyKwh: number): number {
  return energyKwh * TARIFF_CONFIG.pricePerKwh;
}

export function voltageStatus(v: number): "normal" | "high" | "low" {
  if (v > THRESHOLDS.voltage.max) return "high";
  if (v < THRESHOLDS.voltage.min) return "low";
  return "normal";
}

export function leakageStatus(ma: number): "normal" | "detected" {
  return ma >= THRESHOLDS.leakage.warnAt ? "detected" : "normal";
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 5) return "indi";
  if (diffSec < 60) return `${diffSec} saniyə əvvəl`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dəqiqə əvvəl`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat əvvəl`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} gün əvvəl`;
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "short",
  });
}
