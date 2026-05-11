"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  BookOpen,
  Users,
  Star,
  Heart,
  MessageCircle,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { ParticleCanvas } from "@/components/landing/particle-canvas";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&auto=format&fit=crop&q=80",
];

const CREATOR_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&auto=format&fit=crop&q=80";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

/* ============================================================== */
/*  Feature definitions                                            */
/* ============================================================== */
type FeatureKey = "courses" | "creators" | "communities";

interface Feature {
  key: FeatureKey;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  tagline: string;
}

const FEATURES: Feature[] = [
  {
    key: "courses",
    label: "Courses",
    Icon: BookOpen,
    color: "#818CF8",
    tagline: "Learn or teach on-demand",
  },
  {
    key: "creators",
    label: "Creators",
    Icon: Star,
    color: "#F472B6",
    tagline: "Follow the makers you love",
  },
  {
    key: "communities",
    label: "Communities",
    Icon: Users,
    color: "#2DD4BF",
    tagline: "Build thriving groups",
  },
];

const CYCLE_MS = 4200;

/* ============================================================== */
/*  Card scaffolding                                               */
/* ============================================================== */
function CardShell({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="relative w-full h-full">
      {/* Color-tinted glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 -z-10 opacity-80"
        style={{
          background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${color}55 0%, ${color}22 40%, transparent 75%)`,
          filter: "blur(45px)",
          transition: "background 0.5s ease",
        }}
      />

      <div
        className="relative w-full h-full rounded-[20px] overflow-hidden border border-white/[0.08] bg-[rgba(15,17,28,0.78)] backdrop-blur-2xl"
        style={{
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================== */
/*  COURSE preview                                                  */
/* ============================================================== */
function CoursesView() {
  return (
    <CardShell color="#818CF8">
      <div className="relative h-[140px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=500&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F111C] via-[#0F111C]/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold">
              Course
            </div>
            <div className="text-[18px] font-bold text-white leading-tight mt-1">
              Mindful Mornings
            </div>
          </div>
          <div className="flex items-center gap-1.5 h-[22px] px-2 rounded-full bg-black/40 border border-white/15 backdrop-blur-md">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-medium text-white">4.9</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Progress strip */}
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-wider text-white/40 font-medium">
            Progress
          </span>
          <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
            <div className="h-full w-[33%] bg-indigo-400 rounded-full" />
          </div>
          <span className="text-[10.5px] text-white/55 font-medium">4 / 12</span>
        </div>

        {/* Active lesson */}
        <div className="flex items-center gap-3 p-2.5 -mx-1 rounded-xl bg-indigo-500/[0.08] border border-indigo-400/[0.22]">
          <div className="size-9 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Play
              size={13}
              className="text-indigo-300 fill-indigo-300 ml-0.5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white leading-tight">
              Morning breathwork
            </div>
            <div className="text-[10.5px] text-white/45 mt-0.5">
              Lesson 4 · 12 min · Video
            </div>
          </div>
          <ArrowUpRight size={14} className="text-indigo-300 shrink-0" />
        </div>

        <div className="flex items-center gap-3 px-2 -mx-1">
          <CheckCircle2 size={16} className="text-emerald-400/70 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] text-white/55 leading-tight truncate">
              Mindful walking practice
            </div>
          </div>
          <span className="text-[10.5px] text-white/30">18 min</span>
        </div>

        <div className="flex items-center gap-3 px-2 -mx-1">
          <Circle size={16} className="text-white/25 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] text-white/55 leading-tight truncate">
              Evening wind-down ritual
            </div>
          </div>
          <span className="text-[10.5px] text-white/30">15 min</span>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================== */
/*  COMMUNITIES preview                                            */
/* ============================================================== */
function CommunitiesView() {
  return (
    <CardShell color="#2DD4BF">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-teal-400/20 to-emerald-500/20 border border-teal-400/30 flex items-center justify-center">
            <Users size={18} className="text-teal-300" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-teal-300 font-semibold">
              Community
            </div>
            <div className="text-[16px] font-bold text-white leading-tight mt-0.5">
              Mindful Mornings
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10.5px] text-emerald-300 font-medium">
            247 online
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4 border-t border-white/[0.06]">
        {/* Post 1 */}
        <div className="flex gap-3">
          <img
            src={AVATARS[0]}
            alt=""
            className="size-9 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-semibold text-white">
                Sarah K.
              </span>
              <span className="text-[11px] text-white/40">· 2m ago</span>
            </div>
            <p className="text-[12.5px] text-white/75 leading-[18px] mt-1">
              Just finished week 3! The morning flow is changing my life 🧘‍♀️
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-white/45">
                <Heart size={12} className="fill-teal-400 text-teal-400" />
                <span className="text-[11px]">24</span>
              </span>
              <span className="flex items-center gap-1.5 text-white/45">
                <MessageCircle size={12} />
                <span className="text-[11px]">8</span>
              </span>
            </div>
          </div>
        </div>

        {/* Post 2 */}
        <div className="flex gap-3">
          <img
            src={AVATARS[2]}
            alt=""
            className="size-9 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-semibold text-white">
                Mike T.
              </span>
              <span className="text-[11px] text-white/40">· 12m ago</span>
            </div>
            <p className="text-[12.5px] text-white/75 leading-[18px] mt-1">
              Anyone joining the live Q&amp;A at 6pm tonight?
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <span className="text-[12px] text-white/35 flex-1">
            Share with the community…
          </span>
          <button className="shrink-0 size-6 rounded-md bg-teal-500/90 flex items-center justify-center">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================== */
/*  CREATORS preview — creator profile card                        */
/* ============================================================== */
function CreatorsView() {
  return (
    <CardShell color="#F472B6">
      {/* Cover + creator avatar overlay */}
      <div className="relative h-[148px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=900&h=500&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F111C] via-[#0F111C]/40 to-transparent" />

        {/* Top creator badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full bg-pink-500/20 border border-pink-400/40 backdrop-blur-md">
          <Star size={10} className="text-pink-200 fill-pink-300" />
          <span className="text-[10.5px] font-semibold text-pink-200 tracking-wide">
            Top Creator
          </span>
        </div>

        {/* Earnings chip */}
        <div className="absolute top-3 right-3 inline-flex items-center h-[22px] px-2 rounded-full bg-black/55 border border-white/15 backdrop-blur-md">
          <span className="text-[10.5px] font-semibold text-white">
            $8.2K
          </span>
          <span className="text-[10.5px] text-white/55 ml-1">this month</span>
        </div>

        {/* Avatar + name */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
          <img
            src={CREATOR_AVATAR}
            alt=""
            className="size-14 rounded-full object-cover ring-2 ring-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.4)] shrink-0"
          />
          <div className="flex-1 pb-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-pink-300 font-semibold">
              Creator
            </div>
            <div className="text-[17px] font-bold text-white leading-tight mt-0.5 flex items-center gap-1.5">
              <span className="truncate">Sarah Kapoor</span>
              <CheckCircle2
                size={13}
                className="fill-pink-400 text-[#0F111C] shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-3.5">
        <p className="text-[12.5px] text-white/65 leading-[18px]">
          Mindfulness coach helping 12K+ humans build daily rituals through
          courses, live sessions, and curated drops.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "12.4K", l: "Followers" },
            { v: "8", l: "Courses" },
            { v: "3", l: "Communities" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-2.5 py-2 flex flex-col gap-0.5 items-center text-center"
            >
              <span className="text-[14.5px] font-bold text-white leading-tight">
                {s.v}
              </span>
              <span className="text-[9.5px] uppercase tracking-wider text-white/40 font-medium">
                {s.l}
              </span>
            </div>
          ))}
        </div>

        {/* Supporters + Follow CTA */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {AVATARS.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="size-5 rounded-full object-cover border-[1.5px] border-[#0F111C]"
                />
              ))}
            </div>
            <span className="text-[11px] text-white/55">
              <span className="font-semibold text-white">+247</span> this week
            </span>
          </div>
          <button className="h-9 px-3.5 rounded-lg bg-pink-400 hover:bg-pink-300 text-[#0F111C] text-[12px] font-bold flex items-center gap-1.5 transition-colors">
            Follow
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </CardShell>
  );
}


/* ============================================================== */
/*  FEATURE SPOTLIGHT — main right-column visual                   */
/* ============================================================== */
function FeatureSpotlight() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setActive((p) => (p + 1) % FEATURES.length);
      }
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const handleTabClick = (i: number) => {
    setActive(i);
    pausedRef.current = true;
    setTimeout(() => {
      pausedRef.current = false;
    }, 10000);
  };

  const activeFeature = FEATURES[active];

  const renderView = (key: FeatureKey) => {
    switch (key) {
      case "courses":
        return <CoursesView />;
      case "creators":
        return <CreatorsView />;
      case "communities":
        return <CommunitiesView />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full max-w-[440px] mx-auto flex flex-col items-center gap-6"
    >
      {/* Card with morphing content */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-[420px]"
      >
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateY(-5deg) rotateX(2deg)",
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.key}
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0"
            >
              {renderView(activeFeature.key)}
            </motion.div>
          </AnimatePresence>

          {/* Stories-style progress segments — sit inside the card at the very top */}
          <div className="absolute top-[10px] left-[14px] right-[14px] z-30 flex gap-[5px]">
            {FEATURES.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => handleTabClick(i)}
                  aria-label={`Show ${f.label}`}
                  className="relative flex-1 h-[2.5px] rounded-full bg-white/[0.18] overflow-hidden hover:bg-white/30 transition-colors"
                >
                  {isActive && (
                    <motion.div
                      key={`fill-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: CYCLE_MS / 1000,
                        ease: "linear",
                      }}
                      className="absolute inset-0 origin-left rounded-full"
                      style={{
                        background: f.color,
                        boxShadow: `0 0 10px ${f.color}90`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Subtle context line — feature name and tagline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`caption-${activeFeature.key}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex items-center gap-2.5 text-[12.5px] tracking-wide"
        >
          <span
            className="font-semibold"
            style={{ color: activeFeature.color }}
          >
            {activeFeature.label}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/25" />
          <span className="text-white/55">{activeFeature.tagline}</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================================== */
/*  Main hero                                                       */
/* ============================================================== */
export function LandingHeroV2() {
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

      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-[54px] pt-[60px]">
        <div className="h-full grid grid-cols-12 gap-10 items-center">
          {/* Left */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-7">
            <motion.div {...fadeUp(0.05)}>
              <div className="inline-flex items-center gap-2 h-[30px] pl-2.5 pr-3.5 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl">
                <Sparkles size={12} className="text-indigo-300" />
                <span className="text-[12px] text-white/80 font-medium">
                  The all-in-one creator suite
                </span>
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.15)}
              className="font-montserrat font-bold text-white"
              style={{
                fontSize: "68px",
                lineHeight: "74px",
                letterSpacing: "-2px",
              }}
            >
              Everything
              <br />
              creators need,
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-teal-300 bg-clip-text text-transparent">
                in one place.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.28)}
              className="text-[18px] leading-[28px] text-white/55 max-w-[480px]"
            >
              The home for the creators behind every meaningful course and
              community. Build, launch, and grow — all in one place.
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3">
              <Link href="/discover" className="group inline-block">
                <div
                  className="relative rounded-xl p-[2px] overflow-hidden"
                  style={{
                    filter: "drop-shadow(0px 0px 12px rgba(99,102,241,0.5))",
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
                    <span className="text-[15px] leading-6 font-semibold text-white whitespace-nowrap">
                      Start for free
                    </span>
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </Link>

              <button
                type="button"
                className="group inline-flex items-center gap-2 h-[48px] px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white text-[15px] font-semibold transition-colors backdrop-blur-xl"
              >
                <div className="flex items-center justify-center size-6 rounded-full bg-white/10 group-hover:bg-white/15 transition-colors">
                  <Play size={10} className="text-white fill-white ml-px" />
                </div>
                Watch demo
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.55)} className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.slice(0, 5).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="size-8 rounded-full object-cover border-2 border-[#0a0b10]"
                  />
                ))}
              </div>
              <div className="text-[13px] text-white/55">
                Joined by{" "}
                <span className="font-semibold text-white">40,000+ creators</span>
              </div>
            </motion.div>
          </div>

          {/* Right — feature spotlight */}
          <div className="col-span-12 lg:col-span-6 relative h-[620px] hidden lg:flex items-center justify-center">
            <FeatureSpotlight />
          </div>
        </div>
      </div>
    </section>
  );
}
