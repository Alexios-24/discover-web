"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X } from "lucide-react";

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
  { label: "Pricing", href: "/" },
];

// Stable demo avatar (matches the "Katherine Moss" portrait used across the
// logged-in mockups).
export const APP_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&q=60";

// Shared presentational chrome so the plain header and the search-enabled
// Discover header stay pixel-identical. `navHidden`/`noShadow` drive the
// scroll-docked search transitions; `children` renders the docked search bar.
function HeaderChrome({
  variant,
  navHidden = false,
  noShadow = false,
  children,
}: {
  variant: "full" | "minimal";
  navHidden?: boolean;
  noShadow?: boolean;
  children?: ReactNode;
}) {
  return (
    <header
      className={`sticky top-0 z-50 w-full relative bg-white transition-shadow duration-300 ease-out ${
        noShadow ? "" : "shadow-xs"
      }`}
    >
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
            <nav
              className="flex items-center gap-1 transition-opacity duration-300 ease-out max-lg:hidden"
              style={{
                opacity: navHidden ? 0 : 1,
                pointerEvents: navHidden ? "none" : "auto",
              }}
            >
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

      {children}
    </header>
  );
}

// Plain logged-in header — no search, no useSearchParams, fully static-safe.
// Used by the top-picks landing and the personalizing/workspace screens.
export function AppHeader({
  variant = "full",
}: {
  variant?: "full" | "minimal";
}) {
  return <HeaderChrome variant={variant} />;
}

// Logged-in Discover header. Docks an animated search bar into the header once
// the page scrolls past the hero search anchor (`#hero-search`), matching the
// logged-out TopHeader behavior. Must be rendered inside a Suspense boundary
// because it reads search params. Keep the logged-in state (`app=1`) across
// search navigations.
export function DiscoverAppHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get("q") ?? "";
  const hasUrlQuery = urlQuery.length > 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

  const handleScroll = useCallback(() => {
    const heroSearch = document.getElementById("hero-search");
    if (!heroSearch) {
      setIsScrolled(window.scrollY > 60);
      return;
    }
    const rect = heroSearch.getBoundingClientRect();
    const headerHeight = 60;
    setIsScrolled(rect.bottom <= headerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const showHeaderSearch = hasUrlQuery || isScrolled;

  const buildHref = (query: string) =>
    query ? `/discover?app=1&q=${encodeURIComponent(query)}` : "/discover?app=1";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildHref(searchValue.trim()));
  };

  const handleClear = () => {
    setSearchValue("");
    if (hasUrlQuery) {
      router.push(buildHref(""));
    }
    inputRef.current?.focus();
  };

  return (
    <HeaderChrome variant="full" navHidden={showHeaderSearch} noShadow={showHeaderSearch}>
      <AnimatePresence>
        {showHeaderSearch && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="absolute inset-x-0 top-[12px] mx-auto w-[400px] pointer-events-auto max-md:left-4 max-md:right-4 max-md:w-[calc(100vw-32px)]"
          >
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-1 h-9 rounded-md border border-gray-300 bg-white px-2 shadow-xs transition-colors focus-within:border-gray-400"
            >
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for communities, courses, creators"
                className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-gray-900 outline-none placeholder:text-gray-500"
                aria-label="Search"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-500 transition-colors hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </HeaderChrome>
  );
}
