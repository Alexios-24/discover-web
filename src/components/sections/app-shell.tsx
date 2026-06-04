"use client";

import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

// Logged-in chrome shared by the top-picks landing (Figma 2942:30174) and the
// full logged-in Discover (2942:28623): a fixed left icon rail plus the
// logged-in top header above a scrolling content column.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader variant="full" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
