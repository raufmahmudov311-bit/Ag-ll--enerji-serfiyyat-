import { Cpu, Wifi, WifiOff } from "lucide-react";
import { Device } from "@/types/home";
import { cx, formatRelativeTime } from "@/lib/utils";

export function DeviceStatus({ device }: { device: Device }) {
  const isOnline = device.status === "online";

  return (
    <div className="flex items-center justify-between rounded-xl border border-base-700 bg-base-900/70 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span
          className={cx(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isOnline ? "bg-volt-500/10 text-volt-400" : "bg-base-700 text-ink-500"
          )}
        >
          <Cpu size={17} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-medium text-ink-100">{device.name}</p>
          <p className="text-xs text-ink-500">{device.model}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cx(
            "flex items-center justify-end gap-1.5 text-xs font-medium",
            isOnline ? "text-volt-400" : "text-danger-400"
          )}
        >
          {isOnline ? <Wifi size={13} strokeWidth={2} /> : <WifiOff size={13} strokeWidth={2} />}
          {isOnline ? "Onlayn" : "Oflayn"}
        </p>
        <p className="mt-0.5 text-xs text-ink-500">Son məlumat: {formatRelativeTime(device.lastSeen)}</p>
      </div>
    </div>
  );
}
