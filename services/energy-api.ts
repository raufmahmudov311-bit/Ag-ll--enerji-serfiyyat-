import { EnergyReading, ChartRange } from "@/types/energy";
import {
  generateHistoricalSeries,
  initialSimulatorState,
  tickSimulator,
  SimulatorState,
} from "@/lib/simulator";

/**
 * API LAYER
 * ---------
 * Everything above this file (hooks, components) talks only to the
 * functions exported here. Today they are backed by the local simulator.
 * Tomorrow, when a real ESP32 -> backend -> database pipeline exists, only
 * the *implementation* of these functions changes to real `fetch()` calls
 * against NEXT_PUBLIC_API_BASE_URL — every caller stays identical.
 *
 *   Today:    Simulator -> energy-api.ts -> Dashboard
 *   Tomorrow: ESP32 -> Real API -> Database -> energy-api.ts -> Dashboard
 */

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "simulator";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// One simulator state per deviceId, kept in memory for the session.
const simulatorStates = new Map<string, SimulatorState>();
const lastTick = new Map<string, number>();

function getOrInitState(deviceId: string): SimulatorState {
  let state = simulatorStates.get(deviceId);
  if (!state) {
    state = initialSimulatorState();
    simulatorStates.set(deviceId, state);
    lastTick.set(deviceId, Date.now());
  }
  return state;
}

/** Fetches (or, in demo mode, generates) the latest single reading for a device. */
export async function fetchLatestReading(deviceId: string): Promise<EnergyReading> {
  if (DATA_SOURCE === "api") {
    const res = await fetch(`${API_BASE_URL}/devices/${deviceId}/latest`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Sensor məlumatı alınmadı.");
    return res.json();
  }

  const now = Date.now();
  const previous = lastTick.get(deviceId) ?? now;
  const elapsedSeconds = Math.min(30, Math.max(1, (now - previous) / 1000));
  const state = getOrInitState(deviceId);
  const { state: nextState, reading } = tickSimulator(deviceId, state, elapsedSeconds);
  simulatorStates.set(deviceId, nextState);
  lastTick.set(deviceId, now);
  return reading;
}

/** Fetches (or generates) a historical series for a given chart metric/range. */
export async function fetchHistoricalSeries(
  deviceId: string,
  metric: "voltage" | "current" | "power" | "energy" | "leakage",
  range: ChartRange
): Promise<{ timestamp: string; value: number }[]> {
  if (DATA_SOURCE === "api") {
    const res = await fetch(
      `${API_BASE_URL}/devices/${deviceId}/history?metric=${metric}&range=${range}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Tarixçə məlumatı alınmadı.");
    return res.json();
  }

  // seed varies per device+metric so different cards don't look identical
  const seed = hashString(`${deviceId}-${metric}`);
  return generateHistoricalSeries(metric, range, seed);
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 42;
}

export const isSimulatorMode = DATA_SOURCE !== "api";
