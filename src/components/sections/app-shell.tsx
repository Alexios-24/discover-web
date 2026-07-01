"use client";

import { Suspense, type ReactNode } from "react";
import { AppHeader, DiscoverAppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

// Logged-in chrome shared by the top-picks landing (Figma 2942:30174) and the
// full logged-in Discover (2942:28623): a fixed left icon rail plus the
// logged-in top header above a scrolling content column.
//
// `enableHeroSearch` swaps in the Discover header, which docks a search bar into
// the header on scroll (matching the logged-out shell). It is gated so other
// AppShell consumers (e.g. the top-picks landing) stay fully static and never
// read search params.
export function AppShell({
  children,
  enableHeroSearch = false,
}: {
  children: ReactNode;
  enableHeroSearch?: boolean;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {enableHeroSearch ? (
          <Suspense
            fallback={
              <header className="sticky top-0 z-50 h-[60px] w-full bg-white shadow-xs" />
            }
          >
            <DiscoverAppHeader />
          </Suspense>
        ) : (
          <AppHeader variant="full" />
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
