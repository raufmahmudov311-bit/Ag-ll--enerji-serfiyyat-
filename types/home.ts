export interface Home {
  homeId: string;
  userId: string;
  name: string;
  address: string;
  deviceId: string;
  status: "online" | "offline" | "warning";
  lastSeen: string; // ISO 8601
}

export interface Device {
  deviceId: string;
  homeId: string;
  name: string;
  model: string; // e.g. "PZEM-004T (simulyasiya)"
  status: "online" | "offline";
  lastSeen: string; // ISO 8601
  firmwareVersion: string;
}
