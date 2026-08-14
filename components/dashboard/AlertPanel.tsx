import { AlertTriangle, ShieldAlert, Info, Check, BellOff } from "lucide-react";
import { EnergyAlert } from "@/types/energy";
import { cx, formatRelativeTime } from "@/lib/utils";

const SEVERITY_STYLES: Record<EnergyAlert["severity"], { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "bg-amp-500/10 text-amp-400" },
  warning: { icon: AlertTriangle, classes: "bg-warn-500/10 text-warn-400" },
  critical: { icon: ShieldAlert, classes: "bg-danger-500/10 text-danger-400" },
};

export function AlertPanel({
  alerts,
  onResolve,
  compact = false,
}: {
  alerts: EnergyAlert[];
  onResolve?: (alertId: string) => void;
  compact?: boolean;
}) {
  const visible = compact ? alerts.slice(0, 5) : alerts;

  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/70 p-5 shadow-card">
      <h3 className="font-display text-sm font-semibold text-ink-100">Bildirişlər</h3>

      {visible.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <BellOff size={22} strokeWidth={1.5} className="text-ink-500" />
          <p className="mt-3 text-sm text-ink-500">Hələ heç bir bildiriş yoxdur.</p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {visible.map((alert) => {
            const { icon: Icon, classes } = SEVERITY_STYLES[alert.severity];
            const resolved = alert.status === "resolved";
            return (
              <li
                key={alert.alertId}
                className={cx(
                  "flex items-start gap-3 rounded-xl border px-3.5 py-3",
                  resolved ? "border-base-700 bg-base-900/40 opacity-60" : "border-base-700 bg-base-850"
                )}
              >
                <span className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", classes)}>
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-100">{alert.message}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                {onResolve && !resolved && (
                  <button
                    onClick={() => onResolve(alert.alertId)}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-base-600 px-2 py-1 text-xs text-ink-300 hover:border-volt-500 hover:text-volt-400"
                  >
                    <Check size={12} strokeWidth={2.5} />
                    Bağla
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
