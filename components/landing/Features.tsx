import { Gauge, ShieldAlert, LineChart, Home, Bot, Wallet } from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "Real-vaxta yaxın göstəricilər",
    desc: "Gərginlik, cərəyan, güc və enerji sərfiyyatı fasiləsiz yenilənir.",
  },
  {
    icon: ShieldAlert,
    title: "Elektrik sızması aşkarlanması",
    desc: "Qeyri-normal sızma müşahidə olunanda təhlükəsizlik xəbərdarlığı alırsınız.",
  },
  {
    icon: LineChart,
    title: "Ətraflı qrafiklər",
    desc: "24 saat, 7 gün və 30 günlük tarixçəni müqayisə edin.",
  },
  {
    icon: Home,
    title: "Çoxlu ev dəstəyi",
    desc: "Bir neçə evi eyni hesabdan idarə edin və aralarında keçid edin.",
  },
  {
    icon: Bot,
    title: "AI Enerji Köməkçisi",
    desc: "Sərfiyyat dəyişikliklərini sadə dildə izah edən analiz köməkçisi.",
  },
  {
    icon: Wallet,
    title: "Xərc hesablanması",
    desc: "Cari tarifə əsasən təxmini elektrik xərcinizi izləyin.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
          Bir platforma, bütün enerji göstəriciləri
        </h2>
        <p className="mt-3 text-ink-300">
          Sadə evlərdən çox-evli sistemlərə qədər genişlənə bilən struktur.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-xl border border-base-700 bg-base-900/60 p-5 transition hover:border-base-600 hover:bg-base-850"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt-500/10 text-volt-400">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-ink-100">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
