import { EnergyReading } from "@/types/energy";
import { calculatePower } from "@/lib/utils";

/**
 * DEMO / SİMULYASİYA REJİMİ
 * -------------------------
 * There is no real ESP32/sensor connected yet. This module produces
 * realistic-looking readings so the rest of the platform (dashboard, charts,
 * alerts, AI assistant) can be built and used exactly as it will behave once
 * real hardware exists. Nothing outside this file and services/energy-api.ts
 * knows the data is simulated — see SENSOR ARXİTEKTURASI in the README.
 */

const NORMAL_VOLTAGE_RANGE: [number, number] = [225, 235];
const NORMAL_CURRENT_RANGE: [number, number] = [0.5, 15];
const NORMAL_LEAKAGE_RANGE: [number, number] = [0, 5];

// Small chance per tick that the simulator produces a dangerous reading, so
// the alerting UI has something real to react to during a demo.
const VOLTAGE_ANOMALY_CHANCE = 0.04;
const LEAKAGE_ANOMALY_CHANCE = 0.03;

function randomInRange([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

function randomWalk(previous: number, range: [number, number], step: number): number {
  const next = previous + (Math.random() - 0.5) * step;
  return Math.min(range[1], Math.max(range[0], next));
}

export interface SimulatorState {
  voltage: number;
  current: number;
  cumulativeEnergyKwh: number;
}

export function initialSimulatorState(): SimulatorState {
  return {
    voltage: randomInRange(NORMAL_VOLTAGE_RANGE),
    current: randomInRange(NORMAL_CURRENT_RANGE),
    cumulativeEnergyKwh: 6.42,
  };
}

/**
 * Advances the simulator by one tick and returns both the new internal
 * state (to feed back into the next call) and the public EnergyReading.
 */
export function tickSimulator(
  deviceId: string,
  state: SimulatorState,
  elapsedSeconds: number
): { state: SimulatorState; reading: EnergyReading } {
  let voltage = randomWalk(state.voltage, NORMAL_VOLTAGE_RANGE, 2.5);
  let current = randomWalk(state.current, NORMAL_CURRENT_RANGE, 1.2);
  let leakage = randomInRange(NORMAL_LEAKAGE_RANGE);

  // Occasionally simulate a dangerous / abnormal condition so the platform's
  // safety features (alerts, leakage card, notifications) have something to
  // demonstrate. This never happens with real hardware readings — it's a
  // property of the demo data source only.
  if (Math.random() < VOLTAGE_ANOMALY_CHANCE) {
    voltage = Math.random() < 0.5 ? 247 + Math.random() * 4 : 214 - Math.random() * 4;
  }
  if (Math.random() < LEAKAGE_ANOMALY_CHANCE) {
    leakage = 12 + Math.random() * 10;
  }

  const power = calculatePower(voltage, current);
  const energyDeltaKwh = (power * elapsedSeconds) / 3600 / 1000;
  const cumulativeEnergyKwh = state.cumulativeEnergyKwh + energyDeltaKwh;

  const reading: EnergyReading = {
    deviceId,
    timestamp: new Date().toISOString(),
    voltage: round(voltage, 1),
    current: round(current, 2),
    power: round(power, 1),
    energy: round(cumulativeEnergyKwh, 3),
    leakage: round(leakage, 1),
  };

  return {
    state: { voltage, current, cumulativeEnergyKwh },
    reading,
  };
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Generates a historical, deterministic-looking series for charts. Uses a
 * seeded pseudo-random sequence so a given (deviceId, range) always renders
 * the same shape within a session instead of jumping around on re-render.
 */
export function generateHistoricalSeries(
  metric: "voltage" | "current" | "power" | "energy" | "leakage",
  range: "24h" | "7d" | "30d",
  seed = 42
): { timestamp: string; value: number }[] {
  const points = range === "24h" ? 24 : range === "7d" ? 7 * 8 : 30;
  const stepMs =
    range === "24h" ? 60 * 60 * 1000 : range === "7d" ? 3 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  let rngState = seed;
  const rng = () => {
    rngState = (rngState * 9301 + 49297) % 233280;
    return rngState / 233280;
  };

  const now = Date.now();
  const series: { timestamp: string; value: number }[] = [];

  let base: number;
  switch (metric) {
    case "voltage":
      base = 230;
      break;
    case "current":
      base = 6;
      break;
    case "power":
      base = 1400;
      break;
    case "leakage":
      base = 1.5;
      break;
    default:
      base = 0.3; // energy: per-interval consumption
  }

  let cursor = base;
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * stepMs).toISOString();
    const hourOfDay = new Date(now - i * stepMs).getHours();
    // gentle evening peak between 19:00-22:00 for power/current/energy
    const eveningBoost =
      metric === "power" || metric === "current" || metric === "energy"
        ? hourOfDay >= 19 && hourOfDay <= 22
          ? 1.35
          : hourOfDay >= 1 && hourOfDay <= 6
          ? 0.55
          : 1
        : 1;

    const noise = (rng() - 0.5) * (metric === "voltage" ? 6 : metric === "leakage" ? 1.4 : base * 0.25);
    cursor = base * eveningBoost + noise;
    if (metric === "voltage") cursor = Math.min(238, Math.max(222, cursor));
    if (metric === "leakage") cursor = Math.max(0, Math.min(6, cursor));
    if (metric === "current" || metric === "power" || metric === "energy") cursor = Math.max(0, cursor);

    series.push({ timestamp, value: round(cursor, 2) });
  }

  return series;
}
