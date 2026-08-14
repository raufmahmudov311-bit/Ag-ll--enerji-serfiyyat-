import { BatteryCharging } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatEnergy } from "@/lib/utils";

export function EnergyCard({ energy }: { energy: number }) {
  return <StatCard icon={BatteryCharging} label="Enerji sərfiyyatı" value={formatEnergy(energy)} accent="amp" />;
}
