import { Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatPower } from "@/lib/utils";

export function PowerCard({ power }: { power: number }) {
  return <StatCard icon={Zap} label="Güc" value={formatPower(power)} accent="volt" />;
}
