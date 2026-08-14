export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface UserSettings {
  monthlyLimitKwh: number;
  tariffPerKwh: number; // AZN
  notifications: {
    highVoltage: boolean;
    highConsumption: boolean;
    leakage: boolean;
    deviceOffline: boolean;
  };
  theme: "light" | "dark";
}
