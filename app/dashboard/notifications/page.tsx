"use client";

import { useHomeContext } from "@/hooks/HomeProvider";
import { useEnergyData } from "@/hooks/useEnergyData";
import { useAlerts } from "@/hooks/useAlerts";
import { AlertPanel } from "@/components/dashboard/AlertPanel";

export default function NotificationsPage() {
  const { selectedHome } = useHomeContext();
  const { snapshot } = useEnergyData(selectedHome.deviceId);
  const { alerts, resolveAlert } = useAlerts(selectedHome.homeId, selectedHome.deviceId, snapshot);

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-100 sm:text-2xl">Bildirişlər</h1>
        <p className="mt-1 text-sm text-ink-500">
          {activeCount > 0
            ? `${activeCount} aktiv bildiriş — ${selectedHome.name}`
            : `Aktiv bildiriş yoxdur — ${selectedHome.name}`}
        </p>
      </div>

      <AlertPanel alerts={alerts} onResolve={resolveAlert} />

      <div className="rounded-2xl border border-base-700 bg-base-900/60 p-5 text-sm leading-relaxed text-ink-300">
        <p className="font-medium text-ink-100">Bildiriş növləri</p>
        <ul className="mt-3 flex flex-col gap-2">
          <li>⚠️ Yüksək gərginlik — gərginlik normadan yüksəkdir.</li>
          <li>⚠️ Aşağı gərginlik — gərginlik normadan aşağıdır.</li>
          <li>⚠️ Yüksək enerji sərfiyyatı — sərfiyyatınız artıb.</li>
          <li>🔴 Elektrik sızması — sızma aşkarlanıb.</li>
          <li>🔴 Cihaz oflayn — sensor cihazı bağlantısını itirib.</li>
        </ul>
      </div>
    </div>
  );
}
