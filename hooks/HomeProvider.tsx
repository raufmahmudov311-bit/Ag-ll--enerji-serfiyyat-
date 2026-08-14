"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Home } from "@/types/home";
import { DEMO_HOMES } from "@/data/demo-homes";

const STORAGE_KEY = "smart-energy:selected-home";

interface HomeContextValue {
  homes: Home[];
  selectedHome: Home;
  selectHome: (homeId: string) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [homes] = useState<Home[]>(DEMO_HOMES);
  const [selectedHomeId, setSelectedHomeId] = useState<string>(DEMO_HOMES[0].homeId);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && homes.some((h) => h.homeId === saved)) {
      setSelectedHomeId(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectHome(homeId: string) {
    setSelectedHomeId(homeId);
    window.localStorage.setItem(STORAGE_KEY, homeId);
  }

  const selectedHome = homes.find((h) => h.homeId === selectedHomeId) ?? homes[0];

  return (
    <HomeContext.Provider value={{ homes, selectedHome, selectHome }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHomeContext must be used within HomeProvider");
  return ctx;
}
