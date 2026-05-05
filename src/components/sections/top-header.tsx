"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Languages, Search } from "lucide-react";

export function TopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const heroSearch = document.getElementById("hero-search");
    if (!heroSearch) return;

    const rect = heroSearch.getBoundingClientRect();
    const headerHeight = 60;
    setIsScrolled(rect.bottom <= headerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className="sticky top-0 z-50 w-full relative transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: isScrolled ? "none" : "1px solid rgba(234,236,240,0.6)",
        boxShadow: isScrolled ? "none" : "0px 1px 2px 0px rgba(16,24,40,0.05)",
      }}
    >
      <div className="max-w-[1440px] mx-auto h-[60px] flex items-center gap-6 px-[54px] py-2">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <a href="/" className="flex items-center shrink-0 h-8">
            <span className="font-montserrat font-bold text-[22px] leading-none tracking-tight text-gray-900 whitespace-nowrap">
              K<span className="text-indigo-600">o</span>llab
            </span>
          </a>

          <nav
            className="flex items-center gap-1 transition-opacity duration-300 ease-out"
            style={{
              opacity: isScrolled ? 0 : 1,
              pointerEvents: isScrolled ? "none" : "auto",
            }}
          >
            {[
              { label: "Communities", href: "/discover" },
              { label: "Courses", href: "/discover" },
              { label: "Features", href: "/" },
              { label: "Pricing", href: "/" },
            ].map((item) => (
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
          <button className="flex items-center justify-between gap-2 w-[124px] h-9 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-xs hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <Languages size={20} className="text-gray-500" />
              <span className="text-[14px] leading-5 text-gray-900">
                English
              </span>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          <button className="border border-indigo-300 rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-indigo-600 shadow-xs hover:bg-indigo-50 transition-colors">
            Log in
          </button>

          <button className="bg-indigo-600 border border-indigo-600 rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-white shadow-xs hover:bg-indigo-600/90 transition-colors">
            Get started
          </button>
        </div>
      </div>

      {/* Centered Search — appears when hero search leaves viewport */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="absolute inset-x-0 top-[12px] w-[400px] mx-auto pointer-events-auto"
          >
            <button className="w-full flex items-center gap-1 h-9 bg-white border border-gray-300 rounded-md px-2 shadow-xs hover:border-gray-400 transition-colors cursor-pointer">
              <Search size={16} className="text-gray-500 shrink-0" />
              <span className="flex-1 min-w-0 text-[14px] leading-5 text-gray-500 text-left truncate">
                Search for communities, courses, creators
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
