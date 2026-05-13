"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Languages, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Communities", href: "/discover" },
  { label: "Courses", href: "/discover" },
  { label: "Features", href: "/" },
  { label: "Pricing", href: "/" },
];

export function LandingNav() {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Check initial state

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] transition-[background-color,box-shadow] duration-300 ease-out"
      style={{
        backgroundColor: pastHero || menuOpen ? "#ffffff" : "transparent",
        boxShadow: pastHero
          ? "0px 1px 2px 0px rgba(16,24,40,0.05)"
          : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto h-[60px] flex items-center gap-6 px-[54px] py-2 max-md:px-4 max-md:gap-3">
        {/* Hamburger — visible below lg; placed to the left of the logo on mobile/tablet */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="hidden max-lg:flex items-center justify-center w-9 h-9 -ml-1 rounded-md transition-colors order-first"
          style={{
            color: pastHero || menuOpen ? "#101828" : "#ffffff",
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo + Nav */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link href="/" className="flex items-center shrink-0 h-8 relative" aria-label="Kollab home">
            {/* Crossfade between the two logo variants based on top-bar background */}
            <img
              src="/kollab-logo-dark.png"
              alt="Kollab"
              width={320}
              height={128}
              className="h-7 w-auto select-none transition-opacity duration-300 max-md:h-6"
              style={{ opacity: pastHero || menuOpen ? 0 : 1 }}
              draggable={false}
            />
            <img
              src="/kollab-logo-light.png"
              alt=""
              aria-hidden="true"
              width={320}
              height={128}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-auto select-none transition-opacity duration-300 max-md:h-6"
              style={{ opacity: pastHero || menuOpen ? 1 : 0 }}
              draggable={false}
            />
          </Link>

          {/* Desktop nav links — hidden below lg */}
          <nav className="flex items-center gap-1 max-lg:hidden">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-[14px] py-2 rounded-md text-[15px] leading-5 font-medium transition-colors duration-300 ${
                  pastHero
                    ? "text-[#344054] hover:bg-gray-50"
                    : "text-white hover:bg-white/[0.08]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language switcher — hidden below lg */}
          <button
            className="flex items-center justify-between gap-2 w-[124px] h-9 rounded-md px-3 py-2 transition-all duration-300 max-lg:hidden"
            style={{
              backgroundColor: pastHero ? "#ffffff" : "transparent",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: pastHero ? "#EAECF0" : "#475467",
              boxShadow: "0px 1px 1px 0px rgba(16,24,40,0.05)",
            }}
          >
            <div className="flex items-center gap-2">
              <Languages
                size={20}
                className="transition-colors duration-300"
                style={{ color: pastHero ? "#667085" : "rgba(255,255,255,0.7)" }}
              />
              <span
                className="text-[14px] leading-5 transition-colors duration-300"
                style={{ color: pastHero ? "#101828" : "#ffffff" }}
              >
                English
              </span>
            </div>
            <ChevronDown
              size={16}
              className="transition-colors duration-300"
              style={{ color: pastHero ? "#667085" : "rgba(255,255,255,0.7)" }}
            />
          </button>

          {/* Log in — hidden below md */}
          <button
            className="border border-[#A2A4F6] rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold transition-colors duration-300 max-md:hidden"
            style={{
              color: pastHero ? "#343DE5" : "#E0E0FC",
              boxShadow: "0px 1px 1px 0px rgba(16,24,40,0.05)",
            }}
          >
            Log in
          </button>

          <button className="bg-[#343DE5] border border-[#343DE5] rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#343DE5]/90 transition-colors max-md:px-3 max-md:py-1.5 max-md:text-[13px]">
            Get started
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu sheet — slides down below the header */}
      <div
        className={`hidden max-lg:block absolute left-0 right-0 top-[60px] bg-white border-t border-[#EAECF0] shadow-[0_8px_24px_rgba(16,24,40,0.08)] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 text-[16px] leading-6 font-medium text-[#101828] hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="h-px bg-[#EAECF0] mx-6 my-2" />
          <button className="text-left px-6 py-3 flex items-center gap-3 text-[16px] leading-6 font-medium text-[#344054] hover:bg-gray-50 transition-colors">
            <Languages size={20} className="text-[#667085]" />
            <span>English</span>
            <ChevronDown size={16} className="text-[#667085] ml-auto" />
          </button>
          <button className="text-left px-6 py-3 text-[16px] leading-6 font-medium text-[#343DE5] hover:bg-gray-50 transition-colors max-md:block hidden">
            Log in
          </button>
          <Link
            href="/discover"
            onClick={() => setMenuOpen(false)}
            className="md:hidden block mx-6 my-3 bg-[#343DE5] text-white text-center rounded-md px-4 py-3 text-[15px] leading-5 font-semibold"
          >
            Get started for free
          </Link>
        </nav>
      </div>

      {/* Click-outside backdrop */}
      {menuOpen && (
        <div
          className="hidden max-lg:block fixed inset-0 top-[60px] bg-black/30 z-[-1]"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </header>
  );
}
