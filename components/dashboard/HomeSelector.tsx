"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Home as HomeIcon, Check } from "lucide-react";
import { Home } from "@/types/home";
import { cx } from "@/lib/utils";

export function HomeSelector({
  homes,
  selectedHome,
  onSelect,
}: {
  homes: Home[];
  selectedHome: Home;
  onSelect: (homeId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-900/80 px-3.5 py-2 text-sm text-ink-100 hover:border-base-600 hover:bg-base-850"
      >
        <HomeIcon size={15} strokeWidth={1.75} className="text-volt-400" />
        <span className="font-medium">{selectedHome.name}</span>
        <ChevronDown size={14} strokeWidth={2} className="text-ink-500" />
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-card">
          {homes.map((home) => (
            <button
              key={home.homeId}
              onClick={() => {
                onSelect(home.homeId);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm hover:bg-base-850"
            >
              <span>
                <span className="block text-ink-100">{home.name}</span>
                <span className="block text-xs text-ink-500">{home.address}</span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={cx(
                    "h-1.5 w-1.5 rounded-full",
                    home.status === "online" ? "bg-volt-500" : "bg-ink-500"
                  )}
                />
                {home.homeId === selectedHome.homeId && (
                  <Check size={14} strokeWidth={2.5} className="text-volt-400" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
