"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TopHeader } from "@/components/sections/top-header";
import { AppShell } from "@/components/sections/app-shell";
import { DiscoverHero } from "@/components/sections/hero";
import { DiscoverContent } from "@/components/sections/discover-content";

// The Discover page renders in two shells:
//  - logged-out (default): the public top-header (Figma logged-out state).
//  - logged-in (Figma node 2942:28623): the left icon rail + logged-in header.
// For this prototype, logged-in chrome is shown only by the explicit `?app=1`
// query used after onboarding/login-style flows. Plain `/discover` must stay
// public/logged-out even if an older prototype session wrote localStorage.
function DiscoverInner() {
  const searchParams = useSearchParams();
  const loggedIn = searchParams.get("app") === "1";

  if (loggedIn) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1440px]">
          <DiscoverHero />
        </div>
        <div className="mx-auto max-w-[1440px]">
          <DiscoverContent />
        </div>
      </AppShell>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white">
      <TopHeader />
      <div className="mx-auto max-w-[1440px]">
        <DiscoverHero />
      </div>
      <div className="mx-auto max-w-[1440px]">
        <DiscoverContent />
      </div>
    </main>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverInner />
    </Suspense>
  );
}
