import { Gauge } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatVoltage } from "@/lib/utils";

export function VoltageCard({ voltage, status }: { voltage: number; status: "normal" | "high" | "low" }) {
  const statusMap = {
    normal: { text: "Normal", tone: "normal" as const },
    high: { text: "Yüksək", tone: "danger" as const },
    low: { text: "Aşağı", tone: "warning" as const },
  };

  return (
    <StatCard
      icon={Gauge}
      label="Gərginlik"
      value={formatVoltage(voltage)}
      status={statusMap[status]}
      accent="volt"
    />
  );
}
