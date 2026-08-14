import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-700 bg-base-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400">
            <Zap size={16} strokeWidth={2.25} />
          </span>
          <span className="font-display text-sm font-semibold text-ink-100">Smart Energy</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-300 sm:flex">
          <a href="#necə-işləyir" className="hover:text-ink-100">
            Necə işləyir?
          </a>
          <Link href="/login" className="hover:text-ink-100">
            Daxil ol
          </Link>
        </nav>

        <Link
          href="/register"
          className="rounded-lg bg-volt-500 px-4 py-2 text-sm font-semibold text-base-950 transition hover:bg-volt-400"
        >
          Platformanı yoxla
        </Link>
      </div>
    </header>
  );
}
