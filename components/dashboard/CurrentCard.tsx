import { Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrent } from "@/lib/utils";

export function CurrentCard({ current }: { current: number }) {
  return <StatCard icon={Activity} label="Cərəyan" value={formatCurrent(current)} accent="amp" />;
}
