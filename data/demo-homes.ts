import { Home } from "@/types/home";

export const DEMO_HOMES: Home[] = [
  {
    homeId: "home-001",
    userId: "user-001",
    name: "Mənim evim",
    address: "Nərimanov r., Bakı",
    deviceId: "DEVICE-001",
    status: "online",
    lastSeen: new Date().toISOString(),
  },
  {
    homeId: "home-002",
    userId: "user-001",
    name: "Ev 2",
    address: "Xətai r., Bakı",
    deviceId: "DEVICE-002",
    status: "online",
    lastSeen: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    homeId: "home-003",
    userId: "user-001",
    name: "Bağ evi",
    address: "Novxanı, Abşeron",
    deviceId: "DEVICE-003",
    status: "offline",
    lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];
