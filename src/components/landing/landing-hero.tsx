"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, BadgeCheck, X } from "lucide-react";

interface WordDef {
  text: string;
  color: string;
  width: number;
}

const LAUNCH_WORDS: WordDef[] = [
  { text: "communities.", color: "#8385F2", width: 497 },
  { text: "courses.", color: "#2ED3B7", width: 298 },
  { text: "kollab.", color: "#36BFFA", width: 238 },
];

const DISCOVER_WORDS: WordDef[] = [
  { text: "communities.", color: "#8385F2", width: 497 },
  { text: "courses.", color: "#2ED3B7", width: 298 },
  { text: "creators.", color: "#36BFFA", width: 305 },
];

const CYCLE_MS = 2500;

// Default desktop dimensions matching the Figma spec (72px font / 80px line-height).
const STEP_PX_DEFAULT = 94;
const LINE_HEIGHT_DEFAULT = 80;
const GAP_DEFAULT = 14;
// Heading uses `letter-spacing: -1.8px` in *absolute* pixels at every
// breakpoint, which means the tracking eats a constant amount of width
// regardless of font size. When we scale the predefined desktop word
// widths down for mobile, we need to compensate for that constant: at
// scale<1 the rendered word is narrower than `word.width * scale`
// because the absolute tracking is unchanged while the glyphs shrink.
const HEADING_LETTER_SPACING_PX = -1.8;

/**
 * Returns the actual rendered width of `word` at the given `scale`.
 *
 * Derivation: rendered width = chars * glyph + (chars-1) * tracking.
 *   glyph(s)    = glyph(1) * s
 *   tracking(s) = tracking(1)   // ← constant pixel value, not scaled
 *
 *   width(s) = width(1) * s + (chars-1) * tracking * (1 - s)
 *
 * At s = 1 this collapses to word.width (the predefined desktop value),
 * so desktop behaviour is unchanged.
 */
function renderedWordWidth(word: WordDef, scale: number): number {
  const chars = word.text.length;
  return (
    word.width * scale +
    (chars - 1) * HEADING_LETTER_SPACING_PX * (1 - scale)
  );
}

function CyclingText({
  words,
  scale = 1,
}: {
  words: WordDef[];
  /** Scale factor applied to widths, line-height and gap. 1 = desktop default. */
  scale?: number;
}) {
  const lineHeight = LINE_HEIGHT_DEFAULT * scale;
  const gap = GAP_DEFAULT * scale;
  const stepPx = lineHeight + gap;
  const [index, setIndex] = useState(0);
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    setSmooth(false);
    setIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSmooth(true));
    });
  }, [words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [words]);

  useEffect(() => {
    if (index !== words.length) return;

    const timeout = setTimeout(() => {
      setSmooth(false);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSmooth(true));
      });
    }, 650);

    return () => clearTimeout(timeout);
  }, [index, words.length]);

  const word = words[index % words.length];
  const ease = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

  // Use the geometry-aware width helper so the container hugs the
  // current word — on desktop (scale=1) this collapses to word.width
  // (unchanged), on mobile (scale<1) it accounts for the constant-pixel
  // letter-spacing so the box doesn't sit ~15px wider than the glyphs.
  // Tiny +2px safety pad covers sub-pixel rounding (period descender,
  // anti-aliasing) without re-introducing a visible gap before the word.
  const containerWidth = renderedWordWidth(word, scale) + 2;

  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{
        height: lineHeight,
        width: containerWidth,
        transition: smooth ? ease : "none",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          gap,
          transform: `translateY(${-index * stepPx}px)`,
          transition: smooth
            ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {[...words, ...words].map((w, i) => (
          <span
            key={i}
            className="shrink-0 whitespace-nowrap"
            style={{ color: w.color, lineHeight: `${lineHeight}px` }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </span>
  );
}

// useMediaQuery-style hook returning the current responsive size bucket.
// Breakpoints match the CSS on the h1: max-md (<768) and max-lg (<1024).
function useResponsiveSize(): "sm" | "md" | "lg" {
  const [size, setSize] = useState<"sm" | "md" | "lg">("lg");

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 768) setSize("sm");
      else if (w < 1024) setSize("md");
      else setSize("lg");
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return size;
}

const INNER_THUMBS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=68&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=68&auto=format&fit=crop&q=60",
];

const OUTER_THUMBS = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=188&h=106&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=188&h=106&auto=format&fit=crop&q=60",
];

interface OrbitCardProps {
  src: string;
  angle: number;
  rx: number;
  ry: number;
  w: number;
  h: number;
  /** Border radius in px. Defaults to 10 to keep existing desktop usage unchanged. */
  radius?: number;
}

function OrbitCard({ src, angle, rx, ry, w, h, radius = 10 }: OrbitCardProps) {
  const rad = (angle * Math.PI) / 180;
  // Round to 2 decimals so server and client produce identical strings.
  // Without this Node.js and the browser can differ in the last fp digits,
  // causing a React hydration mismatch on these inline styles.
  const x = Math.round(rx * Math.cos(rad) * 100) / 100;
  const y = Math.round(ry * Math.sin(rad) * 100) / 100;
  const tangent = angle + 90;

  return (
    <div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${tangent}deg)`,
      }}
    >
      <div
        className="w-full h-full overflow-hidden shadow-lg"
        style={{
          borderRadius: radius,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

function useCountUp(end: number, duration = 1800, delay = 600) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * eased));
        if (progress < 1) ref.current = requestAnimationFrame(tick);
      };
      ref.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(ref.current);
    };
  }, [end, duration, delay]);

  return value;
}

interface StatDef {
  value: number;
  suffix: string;
  label: string;
}

const LAUNCH_STATS: StatDef[] = [
  { value: 40, suffix: ",000+", label: "creators" },
  { value: 0, suffix: "%", label: "platform fee" },
];

const DISCOVER_STATS: StatDef[] = [
  { value: 4, suffix: "M+", label: "members" },
  { value: 100, suffix: "K", label: "communities" },
  { value: 10, suffix: "K", label: "courses" },
];

function StatItem({ stat, delay }: { stat: StatDef; delay: number }) {
  const count = useCountUp(stat.value, 1600, delay);
  return (
    <div className="flex gap-[4px] items-center whitespace-nowrap text-[16px] max-md:text-[14px]">
      <div className="font-semibold text-white leading-[24px] max-md:leading-[20px]">
        {count}{stat.suffix}
      </div>
      <div className="text-[#D0D5DD] leading-[24px] max-md:text-[#98a2b3] max-md:leading-[20px]">
        {stat.label}
      </div>
    </div>
  );
}

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<"launch" | "discover">("launch");
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const responsive = useResponsiveSize();
  // Scale matches CSS font-size at each breakpoint:
  // <768: 34px → 34/72, 768–1023: 56px → 56/72, ≥1024: 72px → 1.
  const cyclingScale =
    responsive === "sm" ? 34 / 72 : responsive === "md" ? 56 / 72 : 1;
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  // Separate ref for the mobile orbit — desktop refs point to display:none nodes
  // when on mobile, which makes the transform invisible. With its own ref we
  // can drive both versions simultaneously and let CSS decide which is shown.
  const mobileOrbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0.08);
  const targetSpeedRef = useRef(0.08);
  const lastScrollRef = useRef(0);
  const rafRef = useRef(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  const animate = useCallback(() => {
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;
    angleRef.current += speedRef.current;

    if (innerRef.current) {
      innerRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    }
    if (outerRef.current) {
      outerRef.current.style.transform = `rotate(${-angleRef.current * 0.6 - 8.66}deg)`;
    }
    if (mobileOrbitRef.current) {
      mobileOrbitRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    }

    targetSpeedRef.current += (0.08 - targetSpeedRef.current) * 0.02;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastScrollRef.current;
      lastScrollRef.current = now;

      if (dt < 200) {
        targetSpeedRef.current = Math.min(1.2, targetSpeedRef.current + 0.15);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="landing-hero" className="relative h-screen overflow-hidden bg-black max-md:h-[100svh]">
      {/* Floating gradient orbs — same animated orbs on every viewport,
          mobile just gets a slightly smaller variant so the blobs sit
          inside the screen instead of bleeding off it entirely. */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Blue/indigo orb */}
        <div
          className="absolute animate-orb-blue max-md:hidden"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle at center, rgba(50,40,200,0.55) 0%, rgba(30,20,160,0.3) 30%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute animate-orb-blue-mobile hidden max-md:block"
          style={{
            width: "460px",
            height: "460px",
            background:
              "radial-gradient(circle at center, rgba(52,61,229,0.6) 0%, rgba(20,20,160,0.35) 35%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />
        {/* Pink/magenta orb */}
        <div
          className="absolute animate-orb-pink max-md:hidden"
          style={{
            width: "650px",
            height: "650px",
            background:
              "radial-gradient(circle at center, rgba(180,30,120,0.5) 0%, rgba(140,20,90,0.25) 30%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute animate-orb-pink-mobile hidden max-md:block"
          style={{
            width: "460px",
            height: "460px",
            background:
              "radial-gradient(circle at center, rgba(253,111,142,0.55) 0%, rgba(140,30,90,0.35) 35%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Outer orbit ring — hidden on mobile (too cramped); reduced opacity on tablet */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none max-md:hidden">
        <div
          ref={outerRef}
          className="relative opacity-50 will-change-transform"
          style={{ width: 1400, height: 1200 }}
        >
          {OUTER_THUMBS.map((src, i) => (
            <OrbitCard
              key={`outer-${i}`}
              src={src}
              angle={(360 / OUTER_THUMBS.length) * i}
              rx={700}
              ry={700}
              w={94}
              h={53}
            />
          ))}
        </div>
      </div>

      {/* Inner orbit ring — hidden on mobile */}
      <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none max-md:hidden">
        <div
          ref={innerRef}
          className="relative opacity-50 will-change-transform"
          style={{ width: 943, height: 761 }}
        >
          {INNER_THUMBS.map((src, i) => (
            <OrbitCard
              key={`inner-${i}`}
              src={src}
              angle={(360 / INNER_THUMBS.length) * i}
              rx={480}
              ry={480}
              w={60}
              h={34}
            />
          ))}
        </div>
      </div>

      {/* Mobile-only orbit — a CIRCULAR ring large enough that cards only
          ever appear at the top/bottom + far-edge corners of the
          viewport, never crossing the centered heading or CTA stack.
          Card size (48×27, 6.6px radius) is taken straight from the
          Figma thumbnails. The outer ref slowly rotates the whole
          ring so the cards drift in unison. */}
      <div className="absolute inset-0 z-[3] hidden max-md:flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          ref={mobileOrbitRef}
          className="relative opacity-50 will-change-transform"
          style={{ width: 600, height: 600 }}
        >
          {INNER_THUMBS.slice(0, 10).map((src, i) => (
            <OrbitCard
              key={`mob-${i}`}
              src={src}
              angle={(360 / 10) * i + 18}
              rx={290}
              ry={290}
              w={48}
              h={27}
              radius={6.624}
            />
          ))}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center h-full max-md:px-4">
        <div
          className="
            flex flex-col items-center gap-8 w-[723px] text-center
            max-md:w-full max-md:gap-6
          "
        >
          {/* TOP GROUP — tab + heading + subtitle.
              md:contents removes this wrapper at md+ so children flow as
              direct siblings of the gap-8 stack (preserves desktop).
              On mobile, this wrapper just groups tab + heading + subtitle
              with their own internal gap, while the parent column's
              `items-center` vertically centers the whole content block —
              giving symmetric breathing room from the top/bottom orbiting
              cards. */}
          <div
            className="
              md:contents
              max-md:flex max-md:flex-col max-md:items-center
              max-md:gap-6 max-md:w-full
            "
          >
            {/* Tab switcher */}
            <motion.div {...fadeUp(0.1)}>
              <div className="inline-flex items-center justify-center w-[200px] h-[44px] bg-white/[0.25] rounded-full p-2 relative">
                <div
                  className="absolute h-[36px] rounded-full transition-all duration-300 ease-out bg-white/[0.25] border border-gray-200"
                  style={{
                    left: activeTab === "launch" ? "4px" : "50%",
                    right: activeTab === "discover" ? "4px" : "50%",
                  }}
                />
                <button
                  onClick={() => setActiveTab("launch")}
                  className="relative z-10 flex-1 h-[32px] flex items-center justify-center rounded-[20px] text-[14px] leading-5 font-medium text-white transition-colors"
                >
                  Launch
                </button>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="relative z-10 flex-1 h-[32px] flex items-center justify-center rounded-[20px] text-[14px] leading-5 font-medium text-white transition-colors"
                >
                  Discover
                </button>
              </div>
            </motion.div>

            {/* Heading + Subtext */}
            <motion.div {...fadeUp(0.2)} className="flex flex-col gap-2 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
                  className="flex flex-col gap-2"
                >
                  <h1
                    className="font-montserrat font-bold text-white max-lg:!text-[56px] max-lg:!leading-[64px] max-md:!text-[34px] max-md:!leading-[normal] max-md:!tracking-[-1.8px] max-md:-mx-4"
                    style={{
                      fontSize: "72px",
                      lineHeight: "80px",
                      letterSpacing: "-1.8px",
                    }}
                  >
                    {activeTab === "launch" ? (
                      <>
                        <span className="block">Build your business</span>
                        <span className="flex items-center justify-center gap-4 max-md:gap-[6px]">
                          <span>with</span>
                          <CyclingText words={LAUNCH_WORDS} scale={cyclingScale} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="block">Ready to grow?</span>
                        <span className="flex items-center justify-center gap-4 max-md:gap-[6px]">
                          <span>Discover</span>
                          <CyclingText words={DISCOVER_WORDS} scale={cyclingScale} />
                        </span>
                      </>
                    )}
                  </h1>
                  <p className="text-[18px] leading-7 text-gray-300 max-md:text-[14px] max-md:leading-5">
                    {activeTab === "launch"
                      ? "The all-in-one platform to create, launch, and monetize your knowledge."
                      : "Explore thousands of courses & communities built by creators like you."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Search bar — sits between the heading group and the CTA
              group, contributing to the single centered content block on
              mobile. */}
          <motion.div
            {...fadeUp(0.35)}
            className="max-md:w-full max-md:flex max-md:justify-center"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-[400px] h-[44px] bg-white/[0.1] border border-white/[0.2] rounded-xl px-[13px] py-[9px] shadow-[0px_25px_50px_rgba(0,0,0,0.25)] focus-within:bg-white/[0.14] focus-within:border-white/[0.3] transition-colors max-md:w-[360px] max-md:h-[40px]"
            >
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for communities, courses, creators"
                className="flex-1 min-w-0 bg-transparent outline-none text-[16px] leading-6 text-white placeholder:text-gray-400 caret-white max-md:text-[14px] max-md:leading-[20px]"
                aria-label="Search"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="shrink-0 flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </form>
          </motion.div>

          {/* BOTTOM GROUP — CTA + stats. Mirrors top group: md:contents on
              desktop, simple flex column on mobile so the entire content
              block (tab → stats) is centered as one unit by the parent. */}
          <div
            className="
              md:contents
              max-md:flex max-md:flex-col max-md:items-center
              max-md:gap-6 max-md:w-full
            "
          >
            {/* CTA Button */}
            <motion.div {...fadeUp(0.45)}>
            <Link href="/discover" className="group inline-block">
              <div
                className="relative rounded-xl p-[2px] overflow-hidden transition-[filter] duration-300"
                style={{
                  filter:
                    "drop-shadow(0px 0px 6px rgba(255,255,255,0.25))",
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 w-[500px] h-[500px] animate-border-spin"
                  style={{
                    background:
                      "conic-gradient(from 90deg, #101828 0%, #2D233C 1.84%, #492E50 3.68%, #663964 5.53%, #834478 7.37%, #BC5A9F 11.05%, #F670C7 14.73%, #BE65DF 21.23%, #875BF7 27.73%, #5F8DF9 33.75%, #36BFFA 39.76%, #299FEC 42.23%, #1B80DD 44.69%, #0E60CF 47.15%, #0040C1 49.62%, #04369B 62.21%, #082C75 74.81%, #0C224E 87.4%, #101828 100%)",
                  }}
                />
                <div className="relative flex items-center justify-center gap-2 h-[48px] bg-indigo-600 group-hover:bg-black/75 rounded-[10px] group-hover:rounded-xl px-5 py-3 backdrop-blur-[15px] transition-[background-color,border-radius] duration-300">
                  <span className="text-[16px] leading-6 font-semibold text-white whitespace-nowrap">
                    Get started for free
                  </span>
                  <ArrowRight size={20} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.div {...fadeUp(0.55)} className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${activeTab}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                className="flex gap-[8px] items-center justify-center w-full max-md:flex-wrap"
              >
                <div className="flex items-center justify-center size-[18px] max-[520px]:hidden">
                  <BadgeCheck size={18} className="text-[#6172F3]" />
                </div>
                <div className="flex gap-[16px] items-center max-md:gap-3 max-md:flex-wrap max-md:justify-center">
                  {(activeTab === "launch" ? LAUNCH_STATS : DISCOVER_STATS).map(
                    (stat, i) => (
                      <div key={stat.label} className="flex items-center gap-[16px]">
                        {i > 0 && (
                          <div className="size-[5px] rounded-full bg-[#344054]" />
                        )}
                        <StatItem stat={stat} delay={700 + i * 200} />
                      </div>
                    ),
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
