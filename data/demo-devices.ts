import { Device } from "@/types/home";

export const DEMO_DEVICES: Device[] = [
  {
    deviceId: "DEVICE-001",
    homeId: "home-001",
    name: "EV-001",
    model: "PZEM-004T (simulyasiya)",
    status: "online",
    lastSeen: new Date().toISOString(),
    firmwareVersion: "sim-1.0.0",
  },
  {
    deviceId: "DEVICE-002",
    homeId: "home-002",
    name: "EV-002",
    model: "ATM90E32 (simulyasiya)",
    status: "online",
    lastSeen: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    firmwareVersion: "sim-1.0.0",
  },
  {
    deviceId: "DEVICE-003",
    homeId: "home-003",
    name: "EV-003",
    model: "PZEM-004T (simulyasiya)",
    status: "offline",
    lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    firmwareVersion: "sim-0.9.4",
  },
];
