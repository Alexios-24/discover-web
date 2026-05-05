"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Variant = "v1" | "v2";

const VariantContext = createContext<{
  variant: Variant;
  setVariant: (v: Variant) => void;
}>({ variant: "v1", setVariant: () => {} });

export const useVariant = () => useContext(VariantContext);

export function VariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<Variant>("v1");

  return (
    <VariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </VariantContext.Provider>
  );
}

export function VariantSwitcher() {
  const { variant, setVariant } = useVariant();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex items-center bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full p-1 gap-0.5 shadow-lg">
      <button
        onClick={() => setVariant("v1")}
        className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all ${
          variant === "v1"
            ? "bg-white/[0.15] text-white"
            : "text-white/40 hover:text-white/60"
        }`}
      >
        V1
      </button>
      <button
        onClick={() => setVariant("v2")}
        className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all ${
          variant === "v2"
            ? "bg-white/[0.15] text-white"
            : "text-white/40 hover:text-white/60"
        }`}
      >
        V2
      </button>
    </div>
  );
}
