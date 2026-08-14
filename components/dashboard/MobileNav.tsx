"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Cpu, Bell, Settings } from "lucide-react";
import { cx } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/devices", label: "Cihazlar", icon: Cpu },
  { href: "/dashboard/notifications", label: "Bildiriş", icon: Bell },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-base-700 bg-base-900/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around px-2 py-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium",
                active ? "text-volt-400" : "text-ink-500"
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
