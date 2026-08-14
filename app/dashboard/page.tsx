"use client";

import { useHomeContext } from "@/hooks/HomeProvider";
import { useEnergyData } from "@/hooks/useEnergyData";
import { useAlerts } from "@/hooks/useAlerts";
import { VoltageCard } from "@/components/dashboard/VoltageCard";
import { CurrentCard } from "@/components/dashboard/CurrentCard";
import { PowerCard } from "@/components/dashboard/PowerCard";
import { EnergyCard } from "@/components/dashboard/EnergyCard";
import { CostCard } from "@/components/dashboard/CostCard";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";
import { LeakageCard } from "@/components/dashboard/LeakageCard";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { AIAssistant } from "@/components/dashboard/AIAssistant";

export default function DashboardPage() {
  const { selectedHome } = useHomeContext();
  const { snapshot, history } = useEnergyData(selectedHome.deviceId);
  const { alerts, resolveAlert } = useAlerts(selectedHome.homeId, selectedHome.deviceId, snapshot);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-100 sm:text-2xl">İdarə paneli</h1>
        <p className="mt-1 text-sm text-ink-500">{selectedHome.name} · {selectedHome.address}</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        <VoltageCard
          voltage={snapshot?.reading.voltage ?? 0}
          status={snapshot?.voltageStatus ?? "normal"}
        />
        <CurrentCard current={snapshot?.reading.current ?? 0} />
        <PowerCard power={snapshot?.reading.power ?? 0} />
        <EnergyCard energy={snapshot?.reading.energy ?? 0} />
        <CostCard cost={snapshot?.estimatedCostToday ?? 0} />
        <SystemStatusCard status={snapshot?.systemStatus ?? "offline"} />
        <LeakageCard leakage={snapshot?.reading.leakage ?? 0} status={snapshot?.leakageStatus ?? "normal"} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EnergyChart
          deviceId={selectedHome.deviceId}
          metric="voltage"
          title="Gərginlik"
          unit="V"
          color="#3DE8A0"
        />
        <EnergyChart
          deviceId={selectedHome.deviceId}
          metric="current"
          title="Cərəyan"
          unit="A"
          color="#2BB6F0"
        />
        <EnergyChart
          deviceId={selectedHome.deviceId}
          metric="power"
          title="Güc (saatlıq)"
          unit="W"
          color="#F5A623"
          ranges={["24h"]}
        />
        <EnergyChart
          deviceId={selectedHome.deviceId}
          metric="energy"
          title="Enerji sərfiyyatı"
          unit="kWh"
          color="#3DE8A0"
        />
        <EnergyChart
          deviceId={selectedHome.deviceId}
          metric="leakage"
          title="Elektrik sızması tarixçəsi"
          unit="mA"
          color="#F03D3D"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertPanel alerts={alerts} onResolve={resolveAlert} compact />
        <AIAssistant history={history} />
      </div>
    </div>
  );
}
