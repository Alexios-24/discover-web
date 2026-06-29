"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

// Logged-in top header. Two states from Figma (file lSuVFjWScTgFMplHt0JsQK):
//  - "full"    → node 2261:21409 (logo + nav + "Create" + avatar).
//                Used on the logged-in Discover, the top-picks landing, and the
//                discover/learn personalizing screen (node 2948:29350).
//  - "minimal" → node 2948:29182 ("Create flow": logo + avatar only). Used on the
//                create personalizing screen (2940:30669) and the course
//                workspace result (2940:31039).
// Markup mirrors the logged-out top-header layout (h-60, px-54, shadow xs) so the
// two headers line up pixel-for-pixel; only the right side and nav differ.

const NAV_ITEMS = [
  { label: "Discover", href: "/discover?app=1" },
  { label: "Features", href: "/" },
  { label: "Pricing", href: "/" },
];

// Stable demo avatar (matches the "Katherine Moss" portrait used across the
// logged-in mockups).
export const APP_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&q=60";

export function AppHeader({
  variant = "full",
}: {
  variant?: "full" | "minimal";
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      <div className="mx-auto flex h-[60px] w-full max-w-[1440px] items-center gap-6 px-[54px] py-2 max-md:gap-3 max-md:px-4">
        {/* Logo + nav */}
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <a
            href="/"
            aria-label="Kollab home"
            className="flex h-8 shrink-0 items-center"
          >
            <img
              src="/kollab-logo-light.png"
              alt="Kollab"
              width={320}
              height={128}
              className="h-7 w-auto select-none max-md:h-6"
              draggable={false}
            />
          </a>

          {variant === "full" ? (
            <nav className="flex items-center gap-1 max-lg:hidden">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-[14px] py-2 text-[15px] font-medium leading-5 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-3">
          {variant === "full" ? (
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md border border-indigo-600 bg-indigo-600 px-[14px] py-2 text-[14px] font-semibold leading-5 text-white shadow-xs transition-colors hover:bg-indigo-600/90 max-md:px-3"
            >
              <Plus size={20} className="shrink-0" />
              Create
            </button>
          ) : null}

          <span className="block size-8 shrink-0 overflow-hidden rounded-full">
            <img
              src={APP_AVATAR}
              alt="Your profile"
              width={64}
              height={64}
              className="size-full object-cover"
              draggable={false}
            />
          </span>
        </div>
      </div>
    </header>
  );
}
