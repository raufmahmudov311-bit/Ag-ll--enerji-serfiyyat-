/**
 * Sensor-agnostic energy reading shape.
 *
 * This is the single contract the frontend depends on. It intentionally does
 * NOT know about any specific hardware (PZEM-004T, ATM90E32, a custom ESP32
 * firmware, etc). Whatever produces readings — the simulator today, a real
 * device tomorrow — must resolve to this interface. See services/energy-api.ts
 * for where the swap from simulator to real API happens.
 */
export interface EnergyReading {
  deviceId: string;
  timestamp: string; // ISO 8601
  voltage: number; // V
  current: number; // A
  power: number; // W
  energy: number; // kWh, cumulative counter at time of reading
  leakage: number; // mA
}

export type SystemStatus = "online" | "offline" | "warning";

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertType =
  | "voltage_high"
  | "voltage_low"
  | "consumption_high"
  | "leakage_detected"
  | "device_offline";

export interface EnergyAlert {
  alertId: string;
  homeId: string;
  deviceId: string;
  type: AlertType;
  value: number;
  severity: AlertSeverity;
  timestamp: string;
  status: "active" | "resolved";
  message: string;
}

export type ChartRange = "24h" | "7d" | "30d";
export type EnergyGranularity = "daily" | "weekly" | "monthly";

export interface ChartPoint {
  label: string;
  timestamp: string;
  value: number;
}

export interface ConsumptionSummary {
  label: string;
  kwh: number;
  changePercent: number; // vs previous comparable period
}

/** Live snapshot consumed directly by the dashboard cards. */
export interface LiveSnapshot {
  reading: EnergyReading;
  voltageStatus: "normal" | "high" | "low";
  leakageStatus: "normal" | "detected";
  systemStatus: SystemStatus;
  estimatedCostToday: number; // AZN
}
