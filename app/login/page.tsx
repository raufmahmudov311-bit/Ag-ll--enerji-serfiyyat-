"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, LogIn } from "lucide-react";
import { login } from "@/services/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("elvin@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Daxil olmaq mümkün olmadı. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center overflow-y-auto bg-base-950 bg-noise-grid px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-volt-500/15 text-volt-400">
            <Zap size={20} strokeWidth={2.25} />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-100">Hesabınıza daxil olun</h1>
          <p className="mt-1 text-sm text-ink-500">Smart Energy panelinizə davam edin</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-base-700 bg-base-900/70 p-6 shadow-card">
          <label className="block text-sm">
            <span className="text-ink-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-base-600 bg-base-850 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
              placeholder="sizin@email.com"
              autoComplete="email"
              style={{ colorScheme: "dark" }}
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="text-ink-300">Şifrə</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-base-600 bg-base-850 px-3.5 py-2.5 text-sm text-ink-100 outline-none focus:border-volt-500"
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ colorScheme: "dark" }}
            />
          </label>

          {error && <p className="mt-3 text-sm text-danger-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-volt-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-volt-400 disabled:opacity-60"
          >
            <LogIn size={16} strokeWidth={2.25} />
            {loading ? "Yoxlanılır..." : "Daxil ol"}
          </button>

          <p className="mt-5 text-center text-xs text-ink-500">
            Bu, nümayiş girişidir — istənilən email/şifrə qəbul olunur.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Hesabınız yoxdur?{" "}
          <Link href="/register" className="font-medium text-volt-400 hover:text-volt-300">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </main>
  );
}
