import { FlaskConical } from "lucide-react";

export function DemoModeBanner() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amp-500/25 bg-amp-500/[0.07] px-4 py-2.5 text-xs font-medium text-amp-400">
      <FlaskConical size={14} strokeWidth={2} />
      DEMO / SİMULYASİYA REJİMİ — hazırda real sensor qoşulmayıb, məlumatlar simulyator tərəfindən yaradılır.
    </div>
  );
}
