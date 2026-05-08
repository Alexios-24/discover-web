"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const FOOTER_LINKS: { label: string; items: { label: string; href: string }[] }[] = [
  {
    label: "Product",
    items: [
      { label: "Discover", href: "/discover" },
      { label: "Features", href: "/" },
      { label: "Pricing", href: "/" },
      { label: "Integrations", href: "/" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", href: "#" },
      { label: "Help center", href: "#" },
      { label: "Blogs", href: "#" },
      { label: "Community", href: "/discover" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Pages", href: "#" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

const MARQUEE_WORDS = [
  { text: "Communities", color: "#818CF8" },
  { text: "Courses", color: "#2ED3B7" },
  { text: "Creators", color: "#F670C7" },
];

export function LandingFooter() {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Background indigo glow — large bloom centered at bottom matching Figma */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none animate-glow-pulse"
        style={{
          height: "85%",
          background:
            "radial-gradient(ellipse 70% 95% at 50% 110%, rgba(52, 61, 229, 0.85) 0%, rgba(52, 61, 229, 0.55) 18%, rgba(52, 61, 229, 0.28) 38%, rgba(52, 61, 229, 0.1) 58%, transparent 78%)",
        }}
      />

      <div className="relative flex flex-col gap-[72px] py-[54px]">
        {/* Product scroll section — outlined marquee — full width edge-to-edge */}
        <div className="w-full overflow-hidden">
          <div
            className="flex items-center gap-[40px] whitespace-nowrap will-change-transform"
            style={{ animation: "marquee-x 22s linear infinite" }}
          >
            {[...Array(4)].flatMap((_, copy) =>
              MARQUEE_WORDS.map((w, i) => (
                <span key={`${copy}-${i}`} className="inline-flex items-center gap-[40px] shrink-0">
                  <OutlinedWord text={w.text} color={w.color} />
                  <span
                    className="inline-block w-4 h-4 rounded-full border-[1.5px]"
                    style={{ borderColor: "rgba(255,255,255,0.35)" }}
                    aria-hidden
                  />
                </span>
              )),
            )}
          </div>
        </div>

        {/* Main content — aligned with top header (max-w-1440 + 54px horizontal padding) */}
        <div className="max-w-[1440px] mx-auto px-[54px] w-full flex flex-col gap-[40px]">
          {/* Columns row */}
          <div className="flex gap-[160px] items-start w-full">
            {/* Left column — logo, tagline, CTA */}
            <div className="flex flex-col gap-[32px] items-start w-[342px] shrink-0">
              <div className="flex flex-col gap-4 items-start w-full">
                <KollabWordmark />
                <p className="font-inter text-[14px] leading-[20px] font-normal text-[#98A2B3] w-full">
                  The business hub where entrepreneurs build and grow with courses and communities.
                </p>
              </div>

              {/* CTA Button with animated gradient border */}
              <Link href="/discover" className="group inline-block">
                <div
                  className="relative rounded-xl p-[2px] overflow-hidden"
                  style={{
                    filter: "drop-shadow(0px 0px 6px rgba(255,255,255,0.15))",
                  }}
                >
                  <div
                    className="absolute left-1/2 top-1/2 w-[500px] h-[500px] animate-border-spin"
                    style={{
                      background:
                        "conic-gradient(from 90deg, #101828 0%, #2D233C 1.84%, #492E50 3.68%, #663964 5.53%, #834478 7.37%, #BC5A9F 11.05%, #F670C7 14.73%, #BE65DF 21.23%, #875BF7 27.73%, #5F8DF9 33.75%, #36BFFA 39.76%, #299FEC 42.23%, #1B80DD 44.69%, #0E60CF 47.15%, #0040C1 49.62%, #04369B 62.21%, #082C75 74.81%, #0C224E 87.4%, #101828 100%)",
                    }}
                  />
                  <div className="relative flex items-center justify-center gap-2 h-[48px] bg-[#343DE5] group-hover:bg-black/75 rounded-[10px] group-hover:rounded-xl px-5 py-3 backdrop-blur-[15px] transition-[background-color,border-radius] duration-300">
                    <span className="text-[16px] leading-6 font-semibold text-white whitespace-nowrap font-inter">
                      Get started for free
                    </span>
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Right columns */}
            <div className="flex flex-1 gap-[24px] items-start min-w-0">
              {FOOTER_LINKS.map((col) => (
                <div key={col.label} className="flex-1 flex flex-col gap-4 min-w-0">
                  <h4 className="font-inter font-semibold text-[14px] leading-[20px] text-white">
                    {col.label}
                  </h4>
                  <ul className="flex flex-col gap-4">
                    {col.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="font-inter text-[14px] leading-[20px] font-normal text-[#98A2B3] hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

          {/* Bottom row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CopyrightIcon />
              <span className="font-inter text-[13px] leading-[18px] font-normal text-[#98A2B3]">
                2026 Kollab. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-[30px] h-[30px] text-white/80 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="w-[30px] h-[30px] text-white/80 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-[30px] h-[30px] text-white/80 hover:text-white transition-colors">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="YouTube" className="w-[30px] h-[30px] text-white/80 hover:text-white transition-colors">
                <YouTubeIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function OutlinedWord({ text, color }: { text: string; color: string }) {
  // SVG text with stroke renders outline cleanly. -webkit-text-stroke splits the
  // stroke half inside / half outside the glyph, which makes Montserrat Bold look
  // chipped at corners. SVG strokes follow the path properly. We measure the text
  // bbox after mount to size the SVG width exactly to its content.
  const textRef = useRef<SVGTextElement>(null);
  const [width, setWidth] = useState(text.length * 50);

  useLayoutEffect(() => {
    if (!textRef.current) return;
    const bbox = textRef.current.getBBox();
    setWidth(Math.ceil(bbox.width + 4));
  }, [text]);

  return (
    <svg
      width={width}
      height="80"
      className="block shrink-0 overflow-visible"
      shapeRendering="geometricPrecision"
      aria-label={text}
    >
      <text
        ref={textRef}
        x="0"
        y="64"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeMiterlimit="2"
        fontFamily="var(--font-montserrat), Montserrat, sans-serif"
        fontWeight="700"
        fontSize="72"
        style={{ paintOrder: "stroke" }}
      >
        {text}
      </text>
    </svg>
  );
}

function KollabWordmark() {
  return (
    <Link href="/" className="inline-flex items-center h-[41px]" aria-label="Kollab home">
      <span className="font-montserrat font-bold text-[34px] leading-none tracking-tight text-white whitespace-nowrap">
        K
        <span className="text-[#818CF8]">o</span>
        llab
      </span>
    </Link>
  );
}

function CopyrightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z"
        stroke="#98A2B3"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.083 8.333a2.5 2.5 0 1 0 0 3.334"
        stroke="#98A2B3"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
      <path d="M30 15.091C30 6.756 23.284 0 15 0S0 6.756 0 15.091c0 7.532 5.508 13.774 12.704 14.909V19.454h-3.82v-4.363h3.82v-3.327c0-3.773 2.247-5.858 5.685-5.858 1.647 0 3.37.294 3.37.294v3.706h-1.898c-1.87 0-2.452 1.16-2.452 2.35v2.835h4.176l-.668 4.363h-3.508V30C24.492 28.865 30 22.623 30 15.091Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
      <path d="M15 2.703c4.005 0 4.48.015 6.061.087 1.46.067 2.253.311 2.782.516.699.272 1.198.597 1.722 1.121a4.639 4.639 0 0 1 1.121 1.722c.206.529.45 1.322.516 2.782.072 1.581.088 2.056.088 6.061s-.016 4.48-.088 6.061c-.066 1.46-.31 2.253-.516 2.782-.272.699-.596 1.198-1.12 1.722a4.639 4.639 0 0 1-1.723 1.121c-.529.206-1.322.45-2.782.516-1.58.072-2.056.088-6.061.088s-4.48-.016-6.061-.088c-1.46-.066-2.253-.31-2.782-.516a4.639 4.639 0 0 1-1.722-1.12 4.639 4.639 0 0 1-1.121-1.723c-.206-.529-.45-1.322-.516-2.782C2.718 19.472 2.703 18.997 2.703 15s.015-4.48.087-6.061c.067-1.46.311-2.253.516-2.782.272-.699.597-1.198 1.121-1.722a4.639 4.639 0 0 1 1.722-1.121c.529-.206 1.322-.45 2.782-.516C10.512 2.718 10.988 2.703 15 2.703ZM15 0c-4.073 0-4.584.017-6.185.09C7.22.163 5.98.418 4.895.79a6.88 6.88 0 0 0-2.542 1.563A6.88 6.88 0 0 0 .79 4.895C.418 5.98.163 7.22.09 8.815.017 10.416 0 10.927 0 15s.017 4.584.09 6.185c.073 1.596.328 2.836.7 3.92a6.88 6.88 0 0 0 1.563 2.542 6.88 6.88 0 0 0 2.542 1.563c1.084.372 2.324.627 3.92.7C10.416 29.983 10.927 30 15 30s4.584-.017 6.185-.09c1.596-.073 2.836-.328 3.92-.7a6.88 6.88 0 0 0 2.542-1.563 6.88 6.88 0 0 0 1.563-2.542c.372-1.084.627-2.324.7-3.92.073-1.601.09-2.112.09-6.185s-.017-4.584-.09-6.185c-.073-1.596-.328-2.836-.7-3.92a6.88 6.88 0 0 0-1.563-2.542A6.88 6.88 0 0 0 25.105.79C24.02.418 22.78.163 21.185.09 19.584.017 19.073 0 15 0Zm0 7.297a7.703 7.703 0 1 0 0 15.406 7.703 7.703 0 0 0 0-15.406ZM15 20a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm8.007-13.52a1.8 1.8 0 1 0 0-3.602 1.8 1.8 0 0 0 0 3.601Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
      <path d="M27.77 0H2.23A2.23 2.23 0 0 0 0 2.23v25.54C0 29.003.997 30 2.23 30h25.54A2.23 2.23 0 0 0 30 27.77V2.23A2.23 2.23 0 0 0 27.77 0ZM8.89 25.56H4.44V11.25h4.45v14.31ZM6.67 9.44a2.57 2.57 0 1 1 0-5.14 2.57 2.57 0 0 1 0 5.14Zm18.89 16.12h-4.45v-6.96c0-1.66-.03-3.8-2.31-3.8-2.32 0-2.67 1.81-2.67 3.68v7.08h-4.45V11.25h4.27v1.95h.06a4.68 4.68 0 0 1 4.21-2.31c4.5 0 5.34 2.97 5.34 6.82v7.85Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 21" fill="currentColor">
      <path d="M29.37 3.27A3.75 3.75 0 0 0 26.73.63C24.39 0 15 0 15 0S5.61 0 3.27.63A3.75 3.75 0 0 0 .63 3.27C0 5.61 0 10.5 0 10.5s0 4.89.63 7.23a3.75 3.75 0 0 0 2.64 2.64C5.61 21 15 21 15 21s9.39 0 11.73-.63a3.75 3.75 0 0 0 2.64-2.64C30 15.39 30 10.5 30 10.5s0-4.89-.63-7.23ZM12 15V6l7.8 4.5L12 15Z" />
    </svg>
  );
}
