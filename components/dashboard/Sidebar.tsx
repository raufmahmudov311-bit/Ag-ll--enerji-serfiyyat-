"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Cpu, Bell, Settings, Zap, LogOut } from "lucide-react";
import { cx } from "@/lib/utils";
import { logout } from "@/services/auth-api";

const NAV_ITEMS = [
  { href: "/dashboard", label: "İdarə paneli", icon: LayoutDashboard },
  { href: "/dashboard/devices", label: "Cihazlar", icon: Cpu },
  { href: "/dashboard/notifications", label: "Bildirişlər", icon: Bell },
  { href: "/dashboard/settings", label: "Parametrlər", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-base-700 bg-base-900/60 p-4 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-500/15 text-volt-400">
          <Zap size={16} strokeWidth={2.25} />
        </span>
        <span className="font-display text-sm font-semibold text-ink-100">Smart Energy</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-volt-500/10 text-volt-400" : "text-ink-300 hover:bg-base-850 hover:text-ink-100"
              )}
            >
              <Icon size={17} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-base-850 hover:text-danger-400"
      >
        <LogOut size={17} strokeWidth={1.75} />
        Çıxış
      </button>
    </aside>
  );
}
