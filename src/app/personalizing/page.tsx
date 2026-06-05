"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";
import { RocketIcon } from "@/components/icons/ghl-icons";

const DURATION_MS = 3800;
const EASE = [0.22, 0.85, 0.25, 1] as const;

// ── Discover flow photo tiles ─────────────────────────────────────────────────

const TILES = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=240&h=160&auto=format&fit=crop&q=60",
];

const TILE_LAYOUT = [
  { x: -226, y: -86, rotate: -10, w: 116, h: 80 },
  { x: 226,  y: -70, rotate:   9, w: 116, h: 80 },
  { x: -250, y:  84, rotate:   8, w: 116, h: 80 },
  { x: 250,  y:  96, rotate:  -8, w: 116, h: 80 },
  { x: -120, y: 168, rotate:  -5, w: 104, h: 72 },
  { x: 130,  y: 176, rotate:   6, w: 104, h: 72 },
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
            "Curating your top picks",
            "Tuning recommendations",
            "Lining up creators to follow",
            "Almost ready",
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
          {/* Figma node 2957:43904 — 354 × 28 clipping container, cycling text */}
          <div className="h-7 w-[354px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="text-center text-[18px] leading-7 text-[#475467]"
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
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
            {/* Bright head → transparent tail along the arc direction */}
            <linearGradient
              id="create-arc-grad"
              gradientUnits="userSpaceOnUse"
              x1="172" y1="86"
              x2="86"  y2="172"
            >
              <stop offset="0%"   stopColor="#343DE5" stopOpacity="1" />
              <stop offset="65%"  stopColor="#343DE5" stopOpacity="0.35" />
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

// ── Learn flow (unchanged) ────────────────────────────────────────────────────

function LearnPersonalizing({
  phrases,
  phraseIndex,
}: {
  phrases: string[];
  phraseIndex: number;
}) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6">
      {/* Soft brand glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[520px] rounded-full bg-[#343DE5] blur-[140px]"
        initial={{ opacity: 0.12, scale: 0.9 }}
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex scale-[0.78] flex-col items-center sm:scale-90 lg:scale-100">
        {/* Assembly stage */}
        <div className="relative flex h-[420px] w-[640px] items-center justify-center">
          {TILES.map((src, index) => {
            const spot = TILE_LAYOUT[index];
            return (
              <motion.div
                key={src}
                className="absolute overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_rgba(16,24,40,0.16)] ring-1 ring-black/5"
                style={{ width: spot.w, height: spot.h }}
                initial={{ x: 0, y: 0, rotate: 0, scale: 0.3, opacity: 0 }}
                animate={{
                  x: spot.x,
                  y: [spot.y - 6, spot.y + 6, spot.y - 6],
                  rotate: spot.rotate,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.15 + index * 0.1 },
                  scale:   { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                  x:       { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                  rotate:  { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                  y:       { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.85 + index * 0.1 },
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="size-full object-cover"
                  draggable={false}
                />
              </motion.div>
            );
          })}

          {/* Orb */}
          <motion.div
            className="relative flex size-[176px] items-center justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                WebkitMaskImage:
                  "radial-gradient(closest-side, transparent 76%, #000 78%)",
                maskImage:
                  "radial-gradient(closest-side, transparent 76%, #000 78%)",
                background:
                  "conic-gradient(from 0deg, rgba(52,61,229,0), #343DE5 35%, #B2CCFF 50%, #343DE5 65%, rgba(52,61,229,0) 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden
              className="absolute size-[120px] rounded-full bg-[#343DE5] opacity-30 blur-2xl"
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="relative flex size-[104px] items-center justify-center rounded-full text-white"
              style={{
                background:
                  "linear-gradient(160deg, #5B63F5 0%, #343DE5 60%, #2831D3 100%)",
                boxShadow:
                  "0 20px 44px rgba(52,61,229,0.42), inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -12px 22px rgba(0,0,0,0.18)",
              }}
            >
              <span
                aria-hidden
                className="absolute left-1/2 top-[14%] h-1/4 w-1/2 -translate-x-1/2 rounded-full bg-white/40 blur-md"
              />
              <BookOpen size={40} strokeWidth={1.85} />
            </div>
          </motion.div>
        </div>

        {/* Copy + progress */}
        <div className="mt-10 flex w-[360px] max-w-[88vw] flex-col items-center text-center">
          <h1 className="font-montserrat text-[28px] font-bold leading-9 tracking-[-0.5px] text-gray-900 sm:text-[32px]">
            Personalizing your experience
          </h1>
          <div className="mt-2 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="text-[15px] leading-6 text-gray-500"
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="h-full rounded-full bg-[#343DE5]"
              initial={{ width: "6%" }}
              animate={{ width: "100%" }}
              transition={{ duration: DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
