"use client";

import { useEffect, useState } from "react";
import { useHomeContext } from "@/hooks/HomeProvider";
import { getSession } from "@/services/auth-api";
import { UserSettings } from "@/types/user";
import { TARIFF_CONFIG } from "@/config/tariff";
import { Check } from "lucide-react";

const SETTINGS_KEY = "smart-energy:settings";

const DEFAULT_SETTINGS: UserSettings = {
  monthlyLimitKwh: 350,
  tariffPerKwh: TARIFF_CONFIG.pricePerKwh,
  notifications: {
    highVoltage: true,
    highConsumption: true,
    leakage: true,
    deviceOffline: true,
  },
  theme: "dark",
};

export default function SettingsPage() {
  const { selectedHome } = useHomeContext();
  const session = getSession();

  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [homeName, setHomeName] = useState(selectedHome.name);
  const [address, setAddress] = useState(selectedHome.address);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        setSettings(JSON.parse(raw));
      } catch {
        // ignore malformed local data
      }
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleNotification(key: keyof UserSettings["notifications"]) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-100 sm:text-2xl">Parametrlər</h1>
        <p className="mt-1 text-sm text-ink-500">Hesab, ev və bildiriş tənzimləmələri</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <Section title="Profil">
          <Field label="Ad">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </Field>
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" />
          </Field>
        </Section>

        <Section title="Ev">
          <Field label="Ev adı">
            <input value={homeName} onChange={(e) => setHomeName(e.target.value)} className="input" />
          </Field>
          <Field label="Ünvan">
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
          </Field>
        </Section>

        <Section title="Enerji">
          <Field label="Aylıq limit (kWh)">
            <input
              type="number"
              value={settings.monthlyLimitKwh}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, monthlyLimitKwh: Number(e.target.value) }))
              }
              className="input"
            />
          </Field>
          <Field label="Tarif (AZN / kWh)">
            <input
              type="number"
              step="0.001"
              value={settings.tariffPerKwh}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, tariffPerKwh: Number(e.target.value) }))
              }
              className="input"
            />
          </Field>
        </Section>

        <Section title="Bildirişlər">
          <ToggleRow
            label="Yüksək gərginlik"
            checked={settings.notifications.highVoltage}
            onChange={() => toggleNotification("highVoltage")}
          />
          <ToggleRow
            label="Yüksək sərfiyyat"
            checked={settings.notifications.highConsumption}
            onChange={() => toggleNotification("highConsumption")}
          />
          <ToggleRow
            label="Elektrik sızması"
            checked={settings.notifications.leakage}
            onChange={() => toggleNotification("leakage")}
          />
          <ToggleRow
            label="Cihaz oflayn"
            checked={settings.notifications.deviceOffline}
            onChange={() => toggleNotification("deviceOffline")}
          />
        </Section>

        <Section title="Görünüş">
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, theme: mode }))}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  settings.theme === mode
                    ? "border-volt-500 bg-volt-500/10 text-volt-400"
                    : "border-base-600 text-ink-300 hover:text-ink-100"
                }`}
              >
                {mode === "dark" ? "Dark mode" : "Light mode"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-500">
            Hazırda platforma Dark mode üçün optimallaşdırılıb. Light mode seçimi yadda saxlanılır və
            gələcək yeniləmədə tam dəstəklənəcək.
          </p>
        </Section>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-volt-400"
        >
          {saved ? <Check size={16} strokeWidth={2.5} /> : null}
          {saved ? "Yadda saxlanıldı" : "Yadda saxla"}
        </button>
      </form>

      <style jsx global>{`
        .input {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #28395a;
          background: #131f33;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: #eaf0fb;
          outline: none;
        }
        .input:focus {
          border-color: #3de8a0;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-base-700 bg-base-900/70 p-5">
      <h2 className="font-display text-sm font-semibold text-ink-100">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-ink-300">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-200">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-volt-500" : "bg-base-600"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-base-950 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
