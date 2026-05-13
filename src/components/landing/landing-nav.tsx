"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Languages } from "lucide-react";

const NAV_LINKS = [
  { label: "Communities", href: "/discover" },
  { label: "Courses", href: "/discover" },
  { label: "Features", href: "/" },
  { label: "Pricing", href: "/" },
];

export function LandingNav() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Check initial state

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] transition-[background-color,box-shadow] duration-300 ease-out"
      style={{
        backgroundColor: pastHero ? "#ffffff" : "transparent",
        boxShadow: pastHero
          ? "0px 1px 2px 0px rgba(16,24,40,0.05)"
          : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto h-[60px] flex items-center gap-6 px-[54px] py-2">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link href="/" className="flex items-center shrink-0 h-8 relative" aria-label="Kollab home">
            {/* Crossfade between the two logo variants based on top-bar background */}
            <img
              src="/kollab-logo-dark.png"
              alt="Kollab"
              width={320}
              height={128}
              className="h-7 w-auto select-none transition-opacity duration-300"
              style={{ opacity: pastHero ? 0 : 1 }}
              draggable={false}
            />
            <img
              src="/kollab-logo-light.png"
              alt=""
              aria-hidden="true"
              width={320}
              height={128}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-auto select-none transition-opacity duration-300"
              style={{ opacity: pastHero ? 1 : 0 }}
              draggable={false}
            />
          </Link>

          <nav className="flex items-center gap-1">
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
          <button
            className="flex items-center justify-between gap-2 w-[124px] h-9 rounded-md px-3 py-2 transition-all duration-300"
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

          <button
            className="border border-[#A2A4F6] rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold transition-colors duration-300"
            style={{
              color: pastHero ? "#343DE5" : "#E0E0FC",
              boxShadow: "0px 1px 1px 0px rgba(16,24,40,0.05)",
            }}
          >
            Log in
          </button>

          <button className="bg-[#343DE5] border border-[#343DE5] rounded-md px-[14px] py-2 text-[14px] leading-5 font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#343DE5]/90 transition-colors">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
