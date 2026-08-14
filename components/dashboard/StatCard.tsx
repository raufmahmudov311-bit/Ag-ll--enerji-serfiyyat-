import { LucideIcon } from "lucide-react";
import { cx } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  status?: { text: string; tone: "normal" | "warning" | "danger" };
  accent?: "volt" | "amp" | "warn";
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  volt: "bg-volt-500/10 text-volt-400",
  amp: "bg-amp-500/10 text-amp-400",
  warn: "bg-warn-500/10 text-warn-400",
};

const TONE_CLASSES: Record<NonNullable<StatCardProps["status"]>["tone"], string> = {
  normal: "text-volt-400",
  warning: "text-warn-400",
  danger: "text-danger-400",
};

export function StatCard({ icon: Icon, label, value, status, accent = "volt" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/70 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={cx("flex h-9 w-9 items-center justify-center rounded-lg", ACCENT_CLASSES[accent])}>
          <Icon size={17} strokeWidth={1.75} />
        </span>
        {status && (
          <span className={cx("text-xs font-medium", TONE_CLASSES[status.tone])}>{status.text}</span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 font-tabular text-2xl font-semibold text-ink-100">{value}</p>
    </div>
  );
}
