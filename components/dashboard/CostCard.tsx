import { Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCost } from "@/lib/utils";

export function CostCard({ cost }: { cost: number }) {
  return <StatCard icon={Wallet} label="Təxmini xərc" value={formatCost(cost)} accent="warn" />;
}
