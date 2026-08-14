import { Radio } from "lucide-react";
import { cx } from "@/lib/utils";
import { SystemStatus } from "@/types/energy";

const LABELS: Record<SystemStatus, string> = {
  online: "Onlayn",
  offline: "Oflayn",
  warning: "Diqqət",
};

export function SystemStatusCard({ status }: { status: SystemStatus }) {
  const isOnline = status === "online";

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/70 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span
          className={cx(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isOnline ? "bg-volt-500/10 text-volt-400" : "bg-danger-500/10 text-danger-400"
          )}
        >
          <Radio size={17} strokeWidth={1.75} />
        </span>
        <span className={cx("h-2 w-2 rounded-full", isOnline ? "animate-pulseGlow bg-volt-500" : "bg-danger-500")} />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-500">Sistem</p>
      <p className={cx("mt-1 font-tabular text-2xl font-semibold", isOnline ? "text-ink-100" : "text-danger-400")}>
        {LABELS[status]}
      </p>
    </div>
  );
}
