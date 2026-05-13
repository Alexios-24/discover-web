"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Languages, Menu, Search, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Communities", href: "/discover" },
  { label: "Courses", href: "/discover" },
  { label: "Features", href: "/" },
  { label: "Pricing", href: "/" },
];

export function TopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get("q") ?? "";
  const hasUrlQuery = urlQuery.length > 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState(urlQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input value in sync with URL when query changes externally
  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

  const handleScroll = useCallback(() => {
    const heroSearch = document.getElementById("hero-search");
    if (!heroSearch) {
      // On pages without the hero search anchor, fall back to scroll-based showing
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

  // Show the header search whenever there's an active query OR when scrolled past the hero
  const showHeaderSearch = hasUrlQuery || isScrolled;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) {
      router.push("/discover");
      return;
    }
    router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setSearchValue("");
    if (hasUrlQuery) {
      router.push("/discover");
    }
    inputRef.current?.focus();
  };

  return (
    <header
      className="sticky top-0 z-50 w-full relative transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: showHeaderSearch ? "none" : "1px solid rgba(234,236,240,0.6)",
        boxShadow: showHeaderSearch ? "none" : "0px 1px 2px 0px rgba(16,24,40,0.05)",
      }}
    >
      <div className="max-w-[1440px] mx-auto h-[60px] flex items-center gap-6 px-[54px] py-2 max-md:px-4 max-md:gap-3">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <a href="/" className="flex items-center shrink-0 h-8" aria-label="Kollab home">
            <img
              src="/kollab-logo-light.png"
              alt="Kollab"
              width={320}
              height={128}
              className="h-7 w-auto select-none max-md:h-6"
              draggable={false}
            />
          </a>

          <nav
            className="flex items-center gap-1 transition-opacity duration-300 ease-out max-lg:hidden"
            style={{
              opacity: showHeaderSearch ? 0 : 1,
              pointerEvents: showHeaderSearch ? "none" : "auto",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-[14px] py-2 rounded-md text-[15px] leading-5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center justify-between gap-2 w-[124px] h-9 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-xs hover:bg-gray-50 transition-colors max-lg:hidden">
            <div className="flex items-center gap-2">
              <Languages size={20} className="text-gray-500" />
              <span className="text-[14px] leading-5 text-gray-900">
                English
              </span>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          <button className="border border-indigo-300 rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-indigo-600 shadow-xs hover:bg-indigo-50 transition-colors max-md:hidden">
            Log in
          </button>

          <button className="bg-indigo-600 border border-indigo-600 rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-white shadow-xs hover:bg-indigo-600/90 transition-colors max-md:px-3 max-md:py-1.5 max-md:text-[13px]">
            Get started
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="hidden max-lg:flex items-center justify-center w-9 h-9 rounded-md text-[#101828] transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu sheet */}
      <div
        className={`hidden max-lg:block absolute left-0 right-0 top-[60px] bg-white border-t border-[#EAECF0] shadow-[0_8px_24px_rgba(16,24,40,0.08)] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 text-[16px] leading-6 font-medium text-[#101828] hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="h-px bg-[#EAECF0] mx-6 my-2" />
          <button className="text-left px-6 py-3 flex items-center gap-3 text-[16px] leading-6 font-medium text-[#344054] hover:bg-gray-50 transition-colors">
            <Languages size={20} className="text-[#667085]" />
            <span>English</span>
            <ChevronDown size={16} className="text-[#667085] ml-auto" />
          </button>
          <button className="hidden max-md:block text-left px-6 py-3 text-[16px] leading-6 font-medium text-indigo-600 hover:bg-gray-50 transition-colors">
            Log in
          </button>
        </nav>
      </div>

      {/* Centered Search — visible when there's a query or when scrolled past hero search */}
      <AnimatePresence>
        {showHeaderSearch && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="absolute inset-x-0 top-[12px] w-[400px] mx-auto pointer-events-auto max-md:w-[calc(100vw-32px)] max-md:left-4 max-md:right-4"
          >
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center gap-1 h-9 bg-white border border-gray-300 rounded-md px-2 shadow-xs focus-within:border-gray-400 transition-colors"
            >
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for communities, courses, creators"
                className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-5 text-gray-900 placeholder:text-gray-500"
                aria-label="Search"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="shrink-0 flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
