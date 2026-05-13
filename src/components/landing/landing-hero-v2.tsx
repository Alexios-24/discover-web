"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, BadgeCheck, X } from "lucide-react";
import { ParticleCanvas } from "@/components/landing/particle-canvas";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&auto=format&fit=crop&q=80",
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

/* ============================================================== */
/*  Cycling text — exact replica from V1 hero                      */
/* ============================================================== */
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

const WORD_STEP_PX = 94;
const WORD_CYCLE_MS = 2500;

function CyclingText({ words }: { words: WordDef[] }) {
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
    }, WORD_CYCLE_MS);
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
  const ease =
    "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <span
      className="inline-block h-[80px] overflow-hidden align-bottom"
      style={{ width: word.width, transition: smooth ? ease : "none" }}
    >
      <div
        className="flex flex-col gap-[14px]"
        style={{
          transform: `translateY(${-index * WORD_STEP_PX}px)`,
          transition: smooth
            ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {[...words, ...words].map((w, i) => (
          <span
            key={i}
            className="shrink-0 whitespace-nowrap"
            style={{ color: w.color, lineHeight: "80px" }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </span>
  );
}

/* ============================================================== */
/*  Count-up hook                                                   */
/* ============================================================== */
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

function StatItem({ stat, delay: d }: { stat: StatDef; delay: number }) {
  const count = useCountUp(stat.value, 1600, d);
  return (
    <div className="flex gap-[4px] items-center whitespace-nowrap text-[16px]">
      <div className="font-semibold text-white leading-[24px]">
        {count}
        {stat.suffix}
      </div>
      <div className="text-[#D0D5DD] leading-[24px]">{stat.label}</div>
    </div>
  );
}

/* ============================================================== */
/*  Hero Card Deck — Figma 2nd variant hero cards (2291:23349)     */
/* ============================================================== */
type CardKind = "creator" | "community" | "course";

interface FigmaCardData {
  kind: CardKind;
  cover: string;
  title: string;
  description: string;
  bylineAvatar?: string;
  bylineName?: string;
  avatar?: string;
}

const CARDS: FigmaCardData[] = [
  {
    kind: "community",
    cover: "/hero-creator.png",
    title: "F1 enthusiasts",
    description:
      "Where speed lovers swap setups, race recaps and the stories behind every podium",
    bylineName: "Diego Mora",
    bylineAvatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&auto=format&fit=crop&q=80",
  },
  {
    kind: "course",
    cover: "/hero-course.png",
    title: "DeFi Masterclass",
    description:
      "Build, ship and earn from real on-chain protocols across 12 hands-on modules",
    bylineName: "Marcus Chen",
    bylineAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&auto=format&fit=crop&q=80",
  },
  {
    kind: "creator",
    cover: "/hero-community.png",
    title: "Sarah Kapoor",
    description:
      "Mindfulness coach guiding 12K+ creators on the path to clarity & calm",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&auto=format&fit=crop&q=80",
  },
];

const CARD_CYCLE_MS = 5500;

const KIND_LABEL: Record<CardKind, string> = {
  creator: "Creator",
  community: "Community",
  course: "Course",
};

// Positions from Figma frame 2291:23349 — offsets relative to front card
// front (Community): left=31, top=60.76, rotate=0
// 2nd   (Course):    left=38.63, top=31.92, rotate=5
// 3rd   (Creator):   left=44.56, top=0.27,  rotate=11.48
const STACK_POSITIONS = [
  { x: 0, y: 0, rotate: 0, blur: 0 },
  { x: 7.6, y: -28.8, rotate: 5, blur: 1.5 },
  { x: 13.6, y: -60.5, rotate: 11.48, blur: 1.5 },
];

function FigmaHeroCard({ data }: { data: FigmaCardData }) {
  const isCreator = data.kind === "creator";

  return (
    <div
      className="relative w-[326px] rounded-[16px] overflow-hidden border border-[#475467] flex flex-col items-start"
      style={{
        // Approximation of the Figma's rgba(255,255,255,0.1) + backdrop-blur(50px)
        // applied over the near-black hero canvas — rendered as solid so framer-motion's
        // transform context doesn't break the visual.
        background:
          "linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)), #0d0f14",
        ...(isCreator
          ? { height: 278, justifyContent: "space-between" }
          : { gap: 12 }),
      }}
    >
      {/* Creator: cover + avatar wrapped together (h=182) */}
      {/* Community/Course: just the cover */}
      {isCreator ? (
        <div className="w-full shrink-0 flex flex-col items-start" style={{ height: 182 }}>
          {/* Cover with tag */}
          <div
            className="relative w-full shrink-0 overflow-hidden flex flex-col"
            style={{ aspectRatio: "343 / 192", marginBottom: -24 }}
          >
            <img
              src={data.cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative flex-1 flex items-start justify-end p-3 z-10">
              <div
                className="inline-flex items-center justify-center backdrop-blur-[2px] rounded-[12px]"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  height: 22,
                  padding: "0 8px",
                }}
              >
                <span className="font-medium text-center whitespace-nowrap text-[#344054] text-[12px] leading-[17px]">
                  Creator
                </span>
              </div>
            </div>
          </div>

          {/* Avatar row */}
          <div className="w-full px-4 flex items-center">
            <div
              className="rounded-full overflow-hidden border border-[#eaecf0]"
              style={{
                width: 48,
                height: 48,
                transform: "rotate(-1.26deg)",
              }}
            >
              <img
                src={data.avatar!}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative w-full shrink-0 overflow-hidden flex flex-col"
          style={{ aspectRatio: "343 / 192" }}
        >
          <img
            src={data.cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative flex-1 flex items-start justify-end p-3 z-10">
            <div
              className="inline-flex items-center justify-center backdrop-blur-[2px] rounded-[12px]"
              style={{
                background: "rgba(255,255,255,0.75)",
                height: 24,
                padding: "0 8px",
              }}
            >
              <span className="font-medium text-center whitespace-nowrap text-[#344054] text-[13px] leading-[18px]">
                {KIND_LABEL[data.kind]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Text and supporting text */}
      <div className="w-full px-4 pb-4 flex items-center gap-2">
        <div className="flex-1 min-w-0 flex flex-col items-start">
          {isCreator ? (
            <div className="flex flex-col items-start w-full gap-1">
              <p className="text-white font-semibold w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[24px]">
                {data.title}
              </p>
              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[18px] text-[#d0d5dd]">
                {data.description}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start w-full gap-2">
              <div className="flex flex-col items-start w-full gap-[2px]">
                <p className="text-white font-semibold w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-[24px]">
                  {data.title}
                </p>
                {data.bylineName && (
                  <div className="flex items-center gap-1">
                    {data.bylineAvatar && (
                      <img
                        src={data.bylineAvatar}
                        alt=""
                        className="size-4 rounded-full object-cover shrink-0"
                      />
                    )}
                    <p className="whitespace-nowrap text-[11px] leading-4 text-[#d0d5dd]">
                      By {data.bylineName}
                    </p>
                  </div>
                )}
              </div>
              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[18px] text-[#d0d5dd]">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((p) => (p + 1) % CARDS.length);
    }, CARD_CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-[420px] h-[440px] flex items-center justify-center"
    >
      {/* Soft multi-color halo behind the stack */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-16 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(129,140,248,0.18) 0%, rgba(45,212,191,0.10) 35%, rgba(244,114,182,0.08) 60%, transparent 80%)",
          filter: "blur(45px)",
        }}
      />

      {/* Gentle whole-deck float */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {CARDS.map((card, i) => {
          const rel = (i - activeIndex + CARDS.length) % CARDS.length;
          const pos =
            STACK_POSITIONS[rel] ??
            STACK_POSITIONS[STACK_POSITIONS.length - 1];

          return (
            <motion.div
              key={`${card.kind}-${card.title}`}
              initial={false}
              animate={{
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate,
                filter: `blur(${pos.blur}px)`,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 0.85, 0.25, 1],
              }}
              style={{ zIndex: 100 - rel }}
              className="absolute"
            >
              <FigmaHeroCard data={card} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Simple dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {CARDS.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${KIND_LABEL[c.kind]} ${c.title}`}
              className="group p-1 -m-1"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  isActive
                    ? "w-6 bg-white"
                    : "w-2 bg-white/25 group-hover:bg-white/45"
                }`}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============================================================== */
/*  Main hero                                                       */
/* ============================================================== */
export function LandingHeroV2() {
  const [activeTab, setActiveTab] = useState<"launch" | "discover">("launch");
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  return (
    <section
      id="landing-hero"
      className="relative h-screen overflow-hidden bg-[#030305]"
    >
      <div className="absolute inset-0 z-0">
        <ParticleCanvas className="absolute inset-0" />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(3,3,5,0.55) 70%, rgba(3,3,5,0.85) 100%)",
        }}
      />

      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-[54px] pt-[60px] pb-[30px] max-md:px-4 max-md:pt-[80px]">
        <div className="h-full grid grid-cols-12 gap-10 items-center max-md:gap-6">
          {/* Left — pixel-perfect match to Figma node 2269:22572 */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-[44px] items-start max-w-[723px] max-md:gap-6 max-md:items-center max-md:text-center max-md:w-full">
            {/* Tab switcher — 200×44, pill style */}
            <motion.div {...fadeUp(0.1)}>
              <div className="inline-flex items-center justify-center w-[200px] h-[44px] bg-white/[0.25] rounded-full p-2 relative">
                <div
                  className="absolute h-[36px] rounded-full transition-all duration-300 ease-out bg-white/[0.25] border border-[#EAECF0]"
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

            {/* Heading + Subtitle + Search — gap-24px from Figma */}
            <motion.div {...fadeUp(0.2)} className="flex flex-col gap-[24px] items-start w-full">
              <div className="flex flex-col gap-[8px] items-start w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
                    className="flex flex-col gap-[8px] items-start w-full"
                  >
                    <h1
                      className="font-montserrat font-bold text-white text-left max-lg:!text-[56px] max-lg:!leading-[64px] max-md:!text-[34px] max-md:!leading-[normal] max-md:!tracking-[-1.8px] max-md:text-center max-md:-mx-4"
                      style={{
                        fontSize: "72px",
                        lineHeight: "80px",
                        letterSpacing: "-1.8px",
                      }}
                    >
                      {activeTab === "launch" ? (
                        <>
                          <span className="block">Build your business</span>
                          <span className="flex items-center gap-4 max-md:gap-[6px] max-md:justify-center">
                            <span>with</span>
                            <CyclingText words={LAUNCH_WORDS} />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block">Ready to grow?</span>
                          <span className="flex items-center gap-4 max-md:gap-[6px] max-md:justify-center">
                            <span>Discover</span>
                            <CyclingText words={DISCOVER_WORDS} />
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="text-[18px] leading-[28px] text-[#D0D5DD] text-left w-full max-md:text-[14px] max-md:leading-5 max-md:text-center">
                      {activeTab === "launch"
                        ? "The all-in-one platform to create, launch, and monetize your knowledge."
                        : "Explore thousands of courses & communities built by creators like you."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Search bar — 400×44, from Figma */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 w-[400px] h-[44px] bg-white/[0.1] border border-white/[0.2] rounded-xl px-[13px] py-[9px] shadow-[0px_25px_50px_rgba(0,0,0,0.25)] focus-within:bg-white/[0.14] focus-within:border-white/[0.3] transition-colors max-md:w-[min(360px,calc(100vw-32px))]"
              >
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for communities, courses, creators"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[16px] leading-6 text-white placeholder:text-gray-400 caret-white max-md:text-[13px] max-md:leading-5"
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

            {/* CTA Button — "Get started for free" with animated gradient border */}
            <motion.div {...fadeUp(0.45)}>
              <Link href="/discover" className="group inline-block">
                <div
                  className="relative rounded-xl p-[2px] overflow-hidden transition-[filter] duration-300"
                  style={{
                    filter: "drop-shadow(0px 0px 6px rgba(255,255,255,0.25))",
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

            {/* Trust stats — "40,000+ creators • 0% platform fee" */}
            <motion.div {...fadeUp(0.55)} className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stats-${activeTab}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                  className="flex gap-[8px] items-center w-full"
                >
                  <div className="flex items-center justify-center size-[18px]">
                    <BadgeCheck size={18} className="text-[#6172F3]" />
                  </div>
                  <div className="flex gap-[16px] items-center">
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

          {/* Right — Live Creator showcase */}
          <div className="col-span-12 lg:col-span-5 relative h-[620px] hidden lg:flex items-center justify-center">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
