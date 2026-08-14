import { Activity, Cpu, Wifi, Webhook, Server, Database, LayoutDashboard } from "lucide-react";

const NODES = [
  { icon: Activity, title: "Sensor", note: "Voltage / cərəyan ölçmə modulu" },
  { icon: Cpu, title: "ESP32 / IoT", note: "Yerli emal və göndərmə" },
  { icon: Wifi, title: "Wi-Fi / İnternet", note: "Şəbəkəyə çıxış" },
  { icon: Webhook, title: "API", note: "Autentifikasiya + qəbul" },
  { icon: Server, title: "Server", note: "Emal və qaydalar mühərriki" },
  { icon: Database, title: "Verilənlər bazası", note: "Tarixi ölçmələr, siqnallar" },
  { icon: LayoutDashboard, title: "Smart Energy Dashboard", note: "Siz burada baxırsınız" },
];

export function ArchitectureDiagram() {
  return (
    <div className="relative mx-auto max-w-md">
      <div
        aria-hidden
        className="flow-line absolute left-6 top-6 bottom-6 w-px sm:left-7"
      />
      <ol className="relative flex flex-col gap-7">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          const isLast = i === NODES.length - 1;
          return (
            <li key={node.title} className="flex items-start gap-4">
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border sm:h-14 sm:w-14 ${
                  isLast
                    ? "border-volt-500/60 bg-volt-500/10 text-volt-400 shadow-glow"
                    : "border-base-600 bg-base-850 text-ink-300"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className="pt-1.5">
                <p
                  className={`font-display text-sm font-semibold sm:text-base ${
                    isLast ? "text-volt-400" : "text-ink-100"
                  }`}
                >
                  {node.title}
                </p>
                <p className="text-xs text-ink-500 sm:text-sm">{node.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
