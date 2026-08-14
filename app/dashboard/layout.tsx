"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { HomeSelector } from "@/components/dashboard/HomeSelector";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { HomeProvider, useHomeContext } from "@/hooks/HomeProvider";
import { getSession } from "@/services/auth-api";
import { User } from "@/types/user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomeProvider>
      <DashboardShell>{children}</DashboardShell>
    </HomeProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { homes, selectedHome, selectHome } = useHomeContext();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
  }, [router]);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950">
        <p className="text-sm text-ink-500">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-base-700 bg-base-950/90 px-5 py-3.5 backdrop-blur sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <HomeSelector homes={homes} selectedHome={selectedHome} onSelect={selectHome} />
            <p className="hidden text-sm text-ink-500 sm:block">Salam, {user?.name}</p>
          </div>
          <div className="mt-3">
            <DemoModeBanner />
          </div>
        </header>

        <main className="flex-1 px-5 pb-24 pt-6 sm:px-8 lg:pb-8">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
