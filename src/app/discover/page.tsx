"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopHeader } from "@/components/sections/top-header";
import { AppShell } from "@/components/sections/app-shell";
import { DiscoverHero } from "@/components/sections/hero";
import { DiscoverContent } from "@/components/sections/discover-content";

// The Discover page renders in two shells:
//  - logged-out (default): the public top-header (Figma logged-out state).
//  - logged-in (Figma node 2942:28623): the left icon rail + logged-in header.
// Logged-in is the source of truth via the `?app=1` query param (SSR-safe, used
// by every in-app navigation) and, as a fallback for direct visits, the
// `kollabLoggedIn` localStorage flag set at account creation. First paint uses
// only the query param so there is no hydration mismatch; the localStorage
// upgrade happens after mount.
function DiscoverInner() {
  const searchParams = useSearchParams();
  const appParam = searchParams.get("app") === "1";
  const [loggedIn, setLoggedIn] = useState(appParam);

  useEffect(() => {
    if (appParam) {
      setLoggedIn(true);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("kollabLoggedIn") === "1"
    ) {
      setLoggedIn(true);
    }
  }, [appParam]);

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
