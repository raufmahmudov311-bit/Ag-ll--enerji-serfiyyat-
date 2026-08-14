import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cx, formatLeakage } from "@/lib/utils";

export function LeakageCard({ leakage, status }: { leakage: number; status: "normal" | "detected" }) {
  const isDetected = status === "detected";

  return (
    <div
      className={cx(
        "rounded-2xl border p-5 shadow-card sm:col-span-2",
        isDetected ? "border-danger-500/40 bg-danger-500/[0.06]" : "border-base-700 bg-base-900/70"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cx(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                isDetected ? "bg-danger-500/15 text-danger-400" : "bg-volt-500/10 text-volt-400"
              )}
            >
              {isDetected ? <ShieldAlert size={17} strokeWidth={1.75} /> : <ShieldCheck size={17} strokeWidth={1.75} />}
            </span>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Elektrik sızması</p>
          </div>

          <p className={cx("mt-4 font-tabular text-2xl font-semibold", isDetected ? "text-danger-400" : "text-ink-100")}>
            {formatLeakage(leakage)}
          </p>

          <p className={cx("mt-1 text-sm font-medium", isDetected ? "text-danger-400" : "text-volt-400")}>
            {isDetected ? "🔴 Sızma aşkarlanıb" : "🟢 Sızma yoxdur"}
          </p>
        </div>
      </div>

      {isDetected && (
        <p className="mt-4 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3.5 py-2.5 text-sm text-danger-400">
          Elektrik sızması aşkarlanıb. Elektrik sistemini yoxlatdırın.
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        Bu göstərici təhlükəsizlik xəbərdarlığı məqsədi daşıyır və sertifikatlaşdırılmış
        RCD/elektrik qoruyucu cihazın əvəzi deyil. Real quraşdırmada uyğun
        residual-current ölçmə avadanlığı tələb olunur.
      </p>
    </div>
  );
}
