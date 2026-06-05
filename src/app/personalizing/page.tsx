"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";
import { RocketIcon } from "@/components/icons/ghl-icons";

const DURATION_MS = 3800;
const EASE = [0.22, 0.85, 0.25, 1] as const;

// ── Discover flow floating photo cards ───────────────────────────────────────
// x/y are offsets (px) from viewport center; sizes and rotations from Figma node 2948:29350.

const LEARN_CARDS = [
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=320&h=200&auto=format&fit=crop&q=65",
    w: 143, h: 80,  x: -95,  y: -210, rotate: -7.8,  delay: 0.08 },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x: -342, y: -16,  rotate: -9.25, delay: 0.12 },
  { src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x:  262, y: -59,  rotate: 14.04, delay: 0.16 },
  { src: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=320&h=200&auto=format&fit=crop&q=65",
    w: 107, h: 60,  x: -231, y:  290, rotate: -14.26,delay: 0.20 },
  { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x:  283, y:  271, rotate: 11.16, delay: 0.24 },
];

// ─────────────────────────────────────────────────────────────────────────────

function PersonalizingScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") === "learn" ? "learn" : "create";
  const choice = searchParams.get("choice");
  const domainsParam = searchParams.get("domains") ?? "";

  const phrases = useMemo(
    () =>
      intent === "learn"
        ? [
            "Tuning your recommendations.",
            "Finding the good stuff.",
            "Almost ready.",
          ]
        : ["Adding starter content.", "Setting things up.", "Almost ready."],
    [intent],
  );

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((i) => Math.min(i + 1, phrases.length - 1));
    }, DURATION_MS / phrases.length);
    return () => window.clearInterval(interval);
  }, [phrases.length]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (intent === "learn") {
        const query = domainsParam ? `?domains=${domainsParam}` : "";
        router.replace(`/picks${query}`);
      } else {
        router.replace(`/workspace?choice=${choice ?? "course"}`);
      }
    }, DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [router, intent, choice, domainsParam]);

  return (
    <main className="relative flex min-h-screen flex-col bg-white text-gray-900">
      <AppHeader variant={intent === "learn" ? "full" : "minimal"} />
      {intent === "create" ? (
        <CreatePersonalizing phrases={phrases} phraseIndex={phraseIndex} />
      ) : (
        <LearnPersonalizing phrases={phrases} phraseIndex={phraseIndex} />
      )}
    </main>
  );
}

export default function PersonalizingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen w-full bg-white" />}>
      <PersonalizingScreen />
    </Suspense>
  );
}

// ── Create flow — Figma node 2940:30669 ───────────────────────────────────────
//
// Full-screen white canvas. Four floating UI panels assembled around a centered
// orb with a spinning gradient arc stroke. Panel positions are percentage-based
// offsets derived from the 1440 × 960 Figma artboard.

function CreatePersonalizing({
  phrases,
  phraseIndex,
}: {
  phrases: string[];
  phraseIndex: number;
}) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Top-left: course name + description form (Figma: image 42) */}
      <CreateFloatingPanel left="24.04%" top="25.39%" rotation={-9.67} delay={0.08}>
        <CourseFormCard />
      </CreateFloatingPanel>

      {/* Top-right: community channels list (Figma: image 43) */}
      <CreateFloatingPanel left="61.24%" top="29.60%" rotation={6.79} delay={0.14}>
        <ChannelsCard />
      </CreateFloatingPanel>

      {/* Bottom-left: lesson status dropdown (Figma: Dropdown) */}
      <CreateFloatingPanel left="26.86%" top="65%" rotation={-7.69} delay={0.20}>
        <StatusDropdownCard />
      </CreateFloatingPanel>

      {/* Bottom-right: lesson thumbnail upload (Figma: image 44) */}
      <CreateFloatingPanel left="59.64%" top="63.60%" rotation={14.21} delay={0.26}>
        <ThumbnailCard />
      </CreateFloatingPanel>

      {/* Centre: orb + heading + cycling subtitle */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
        <CreateOrb />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-montserrat text-[40px] font-bold leading-normal tracking-[-0.5px] text-[#101828]">
            Personalizing your workspace
          </h1>
          {/* Figma node 2957:43904 — 354 × 28 clip window, slot-machine scroll */}
          <div className="h-7 w-[354px] overflow-hidden">
            <motion.div
              className="flex flex-col"
              style={{ gap: 16 }}
              animate={{ y: -(phraseIndex * 44) }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {phrases.map((phrase, i) => (
                <p
                  key={i}
                  className="shrink-0 text-center text-[18px] leading-7 text-[#475467]"
                >
                  {phrase}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Orb: faint track ring + spinning gradient arc + filled blue circle + GHL rocket
function CreateOrb() {
  const R = 81;
  const C = 2 * Math.PI * R; // ≈ 508.9
  const arcLen = +(C * 0.78).toFixed(1); // ~396.9 — 78 % filled
  const gapLen = +(C - arcLen).toFixed(1);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 172, height: 172 }}
    >
      {/* Faint track circle */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 172 172"
        aria-hidden
      >
        <circle
          cx="86" cy="86" r={R}
          fill="none"
          stroke="rgba(52,61,229,0.14)"
          strokeWidth="2"
        />
      </svg>

      {/* Spinning gradient arc — gives the sense that something is happening */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      >
        <svg className="size-full" viewBox="0 0 172 172" aria-hidden>
          <defs>
            {/* Bright leading edge → transparent tail */}
            <linearGradient
              id="create-arc-grad"
              gradientUnits="userSpaceOnUse"
              x1="172" y1="0"
              x2="0"   y2="172"
            >
              <stop offset="0%"   stopColor="#7B83F5" stopOpacity="1" />
              <stop offset="30%"  stopColor="#5B63F5" stopOpacity="0.9" />
              <stop offset="60%"  stopColor="#343DE5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#343DE5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="86" cy="86" r={R}
            fill="none"
            stroke="url(#create-arc-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${gapLen}`}
          />
        </svg>
      </motion.div>

      {/* Inner filled circle */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full text-white"
        style={{
          width: 120,
          height: 120,
          background: "linear-gradient(160deg, #5B63F5 0%, #343DE5 60%, #2831D3 100%)",
          boxShadow:
            "0 20px 44px rgba(52,61,229,0.42), inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -12px 22px rgba(0,0,0,0.18)",
        }}
      >
        {/* Specular highlight */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[14%] h-1/4 w-1/2 -translate-x-1/2 rounded-full bg-white/40 blur-md"
        />
        <span className="relative">
          <RocketIcon size={48} />
        </span>
      </div>
    </div>
  );
}

// Wrapper: fade+scale in, then gentle vertical bob
function CreateFloatingPanel({
  children,
  left,
  top,
  rotation,
  delay,
}: {
  children: ReactNode;
  left: string;
  top: string;
  rotation: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left, top, rotate: rotation }}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{
        opacity: { duration: 0.42, delay },
        scale:   { duration: 0.55, ease: EASE, delay },
        y:       { duration: 5 + delay * 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.55 },
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Panel cards ───────────────────────────────────────────────────────────────

// Panel 1 — Course name + description form (212 × 159 from Figma)
function CourseFormCard() {
  return (
    <div
      className="rounded-2xl border border-[#eaecf0] bg-white p-4 shadow-[0_12px_50px_-12px_rgba(16,24,40,0.12)]"
      style={{ width: 212 }}
    >
      <div className="mb-3">
        <p className="mb-1 text-[11px] font-medium text-[#344054]">Course name</p>
        <div className="rounded-md border border-[#d0d5dd] px-3 py-[5px]">
          <span className="text-[11.5px] text-[#101828]">F1 enthusiasts</span>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-medium text-[#344054]">Description</p>
        <div
          className="relative rounded-md border border-[#d0d5dd] px-3 py-2"
          style={{ height: 68 }}
        >
          <p className="text-[10px] leading-relaxed text-[#98a2b3]">
            Tell people what your community is about
          </p>
          <span className="absolute bottom-2 right-2 text-[9.5px] text-[#98a2b3]">
            0 / 200
          </span>
        </div>
      </div>
    </div>
  );
}

// Panel 2 — Community channels list (120 × 128 from Figma)
function ChannelsCard() {
  const channels: { emoji: string; label: string; active?: boolean }[] = [
    { emoji: "🏠", label: "Home",             active: true },
    { emoji: "📖", label: "Introduction" },
    { emoji: "🚩", label: "Resources" },
    { emoji: "❤️", label: "Health & vitality" },
  ];

  return (
    <div
      className="rounded-2xl border border-[#eaecf0] bg-white p-3 shadow-[0_12px_50px_-12px_rgba(16,24,40,0.12)]"
      style={{ width: 120 }}
    >
      <p className="mb-2 text-[10px] font-semibold text-[#343DE5]">Channels</p>
      <div className="flex flex-col gap-[3px]">
        {channels.map((ch) => (
          <div
            key={ch.label}
            className={`flex items-center gap-1.5 rounded-md px-1.5 py-[3px] ${
              ch.active ? "bg-[#f5f5f5]" : ""
            }`}
          >
            <span className="text-[11px] leading-none">{ch.emoji}</span>
            <span
              className={`truncate text-[9.5px] leading-[14px] ${
                ch.active ? "font-semibold text-[#101828]" : "text-[#475467]"
              }`}
            >
              {ch.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Panel 3 — Lesson status dropdown: Draft / Publish / Lock / Drip (160px wide)
// Colors from Figma: Draft #475467, Publish #039855, Lock #f79009, Drip #343DE5
function StatusDropdownCard() {
  const items = [
    { icon: "file",          label: "Draft",   color: "#475467", bg: undefined,  check: false },
    { icon: "check-circle",  label: "Publish", color: "#039855", bg: undefined,  check: false },
    { icon: "lock",          label: "Lock",    color: "#f79009", bg: undefined,  check: false },
    { icon: "clock",         label: "Drip",    color: "#343DE5", bg: "#eff4ff",  check: true  },
  ] as const;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#eaecf0] bg-white shadow-[0_12px_50px_-12px_rgba(16,24,40,0.12)]"
      style={{ width: 160 }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-2 py-[7px]"
          style={{ backgroundColor: item.bg }}
        >
          <span className="flex size-[14px] shrink-0 items-center justify-center">
            <DropdownIcon name={item.icon} color={item.color} />
          </span>
          <span
            className="flex-1 text-[13px] font-semibold leading-[18px]"
            style={{ color: item.color }}
          >
            {item.label}
          </span>
          {item.check && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8.5 6.5 12 13 5"
                stroke={item.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

type DropdownIconName = "file" | "check-circle" | "lock" | "clock";

function DropdownIcon({ name, color }: { name: DropdownIconName; color: string }) {
  if (name === "file") return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8 1.5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5M8 1.5 11.5 5M8 1.5V5h3.5"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
  if (name === "check-circle") return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2" />
      <path
        d="M4.5 7 6.5 9 9.5 5"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
  if (name === "lock") return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="3" y="6.5" width="8" height="6" rx="1" stroke={color} strokeWidth="1.2" />
      <path d="M5 6.5V4.5a2 2 0 0 1 4 0v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.2" />
      <path
        d="M7 4.5V7l2 2"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// Panel 4 — Lesson thumbnail upload card (~191 × 156 from Figma)
function ThumbnailCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#eaecf0] bg-white shadow-[0_12px_50px_-12px_rgba(16,24,40,0.12)]"
      style={{ width: 191 }}
    >
      {/* Tabs */}
      <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-2.5">
        <span className="rounded-full bg-[#343DE5] px-2 py-[2px] text-[8.5px] font-semibold text-white">
          Lesson thumbnail
        </span>
        <span className="rounded-full bg-[#f2f4f7] px-2 py-[2px] text-[8.5px] font-medium text-[#475467]">
          Media thumbnail
        </span>
      </div>

      {/* Dark photo — mimics the studio/microphone shot in Figma */}
      <div
        className="relative mx-2.5 overflow-hidden rounded-lg"
        style={{
          height: 90,
          background:
            "linear-gradient(145deg, #1a1a2e 0%, #16213e 35%, #0f3460 65%, #1c1c3a 100%)",
        }}
      >
        {/* Faint mic silhouette for texture */}
        <svg
          className="absolute inset-0 m-auto opacity-[0.15]"
          width="28" height="42"
          viewBox="0 0 28 42"
          fill="white"
          aria-hidden
        >
          <rect x="8" y="0" width="12" height="24" rx="6" />
          <path d="M2 18c0 6.627 5.373 12 12 12s12-5.373 12-12" stroke="white" strokeWidth="2" fill="none" />
          <rect x="13" y="30" width="2" height="7" />
          <rect x="8" y="37" width="12" height="2" rx="1" />
        </svg>
      </div>

      {/* Caption */}
      <p className="px-2.5 py-2 text-[8.5px] leading-4 text-[#667085]">
        Recommended dimensions of 1280×720
      </p>
    </div>
  );
}

// ── Learn flow — Figma node 2948:29350 ───────────────────────────────────────
//
// White canvas. Five floating photo cards scattered around a centred orb.
// No progress bar. Slot-machine subtitle matches create-flow behaviour.

function LearnPersonalizing({
  phrases,
  phraseIndex,
}: {
  phrases: string[];
  phraseIndex: number;
}) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Scattered floating photo cards */}
      {LEARN_CARDS.map((card, i) => (
        <LearnFloatingCard key={i} {...card} />
      ))}

      {/* Centre: orb + heading + slot-machine subtitle */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
        <LearnOrb />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-montserrat text-[40px] font-bold leading-normal tracking-[-0.5px] text-[#101828]">
            Personalizing your experience
          </h1>
          {/* Figma node 2957:43946 — 354 × 28 clip window, slot-machine scroll */}
          <div className="h-7 w-[354px] overflow-hidden">
            <motion.div
              className="flex flex-col"
              style={{ gap: 16 }}
              animate={{ y: -(phraseIndex * 44) }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {phrases.map((phrase, i) => (
                <p
                  key={i}
                  className="shrink-0 text-center text-[18px] leading-7 text-[#475467]"
                >
                  {phrase}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Orb for the discover / learn flow — same visual as create flow but with a book icon
function LearnOrb() {
  const R = 81;
  const C = 2 * Math.PI * R;
  const arcLen = +(C * 0.78).toFixed(1);
  const gapLen = +(C - arcLen).toFixed(1);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 172, height: 172 }}
    >
      {/* Faint track circle */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 172 172" aria-hidden>
        <circle
          cx="86" cy="86" r={R}
          fill="none"
          stroke="rgba(52,61,229,0.14)"
          strokeWidth="2"
        />
      </svg>

      {/* Spinning gradient arc */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      >
        <svg className="size-full" viewBox="0 0 172 172" aria-hidden>
          <defs>
            <linearGradient
              id="learn-arc-grad"
              gradientUnits="userSpaceOnUse"
              x1="172" y1="0"
              x2="0"   y2="172"
            >
              <stop offset="0%"   stopColor="#7B83F5" stopOpacity="1" />
              <stop offset="30%"  stopColor="#5B63F5" stopOpacity="0.9" />
              <stop offset="60%"  stopColor="#343DE5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#343DE5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="86" cy="86" r={R}
            fill="none"
            stroke="url(#learn-arc-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${gapLen}`}
          />
        </svg>
      </motion.div>

      {/* Inner filled circle */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full text-white"
        style={{
          width: 120,
          height: 120,
          background: "linear-gradient(160deg, #5B63F5 0%, #343DE5 60%, #2831D3 100%)",
          boxShadow:
            "0 20px 44px rgba(52,61,229,0.42), inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -12px 22px rgba(0,0,0,0.18)",
        }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-[14%] h-1/4 w-1/2 -translate-x-1/2 rounded-full bg-white/40 blur-md"
        />
        <span className="relative">
          <BookOpen size={48} strokeWidth={1.85} />
        </span>
      </div>
    </div>
  );
}

// Individual floating photo card — positioned by pixel offset from viewport centre
function LearnFloatingCard({
  src,
  w,
  h,
  x,
  y,
  rotate,
  delay,
}: {
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rotate: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute overflow-hidden rounded-xl shadow-[0_18px_40px_rgba(16,24,40,0.16)] ring-1 ring-black/5"
      style={{
        left: `calc(50% + ${x - w / 2}px)`,
        top: `calc(50% + ${y - h / 2}px)`,
        width: w,
        height: h,
        rotate,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.45, delay },
        scale:   { duration: 0.55, ease: EASE, delay },
        y:       { duration: 5 + delay * 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.55 },
      }}
    >
      <img src={src} alt="" className="size-full object-cover" draggable={false} />
    </motion.div>
  );
}
