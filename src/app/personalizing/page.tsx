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
// x/y: px offsets from viewport centre. initialY: entry slide direction (neg=from above).

const LEARN_CARDS = [
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=320&h=200&auto=format&fit=crop&q=65",
    w: 143, h: 80,  x: -115, y: -245, rotate: -7.8,  delay: 0.08, initialY: -20 },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x: -400, y:  -20, rotate: -9.25, delay: 0.12, initialY: -15 },
  { src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x:  310, y:  -75, rotate: 14.04, delay: 0.16, initialY: -18 },
  { src: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=320&h=200&auto=format&fit=crop&q=65",
    w: 107, h: 60,  x: -275, y:  290, rotate: -14.26,delay: 0.20, initialY:  20 },
  { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=320&h=200&auto=format&fit=crop&q=65",
    w: 129, h: 72,  x:  335, y:  271, rotate: 11.16, delay: 0.24, initialY:  20 },
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
      {/* Top-left: course name + description form (Figma image 42, 212×159) */}
      <CreateFloatingPanel left="16%" top="17%" rotation={-9.67} delay={0.08} initialY={-20} pullX={30} pullY={26}>
        <FloatingImage src="/personalizing/create-course-form.png" w={212} h={159} />
      </CreateFloatingPanel>

      {/* Top-right: community channels list (Figma image 43, 120×128) */}
      <CreateFloatingPanel left="67%" top="21%" rotation={6.79} delay={0.14} initialY={-20} pullX={-28} pullY={28}>
        <FloatingImage src="/personalizing/create-channels.png" w={120} h={128} />
      </CreateFloatingPanel>

      {/* Bottom-left: lesson status dropdown (Figma vector component) */}
      <CreateFloatingPanel left="19%" top="71%" rotation={-7.69} delay={0.20} initialY={20} pullX={30} pullY={-26}>
        <StatusDropdownCard />
      </CreateFloatingPanel>

      {/* Bottom-right: lesson thumbnail upload (Figma image 44, 191×156) */}
      <CreateFloatingPanel left="65%" top="68%" rotation={14.21} delay={0.26} initialY={20} pullX={-28} pullY={-26}>
        <FloatingImage src="/personalizing/create-thumbnail.png" w={191} h={156} />
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

// Wrapper: directional slide-in + fade, then subtle organic drift (y+x).
// Outer handles entry; inner handles the continuous float so they don't conflict.
function CreateFloatingPanel({
  children,
  left,
  top,
  rotation,
  delay,
  initialY,
  pullX,
  pullY,
}: {
  children: ReactNode;
  left: string;
  top: string;
  rotation: number;
  delay: number;
  initialY: number;
  // Vector (px) pointing toward the centre orb — the panel eases in along it, then back out.
  pullX: number;
  pullY: number;
}) {
  // Counter-rotate the inner translate so the pull is true-to-screen toward centre,
  // not skewed by the panel's resting tilt.
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const localX = pullX * cos + pullY * sin;
  const localY = -pullX * sin + pullY * cos;
  const drift = 7.5 + delay * 4; // gentle, slightly varied per panel

  return (
    <motion.div
      className="absolute"
      style={{ left, top, rotate: rotation }}
      initial={{ opacity: 0, scale: 0.9, y: initialY }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.55, ease: "easeOut", delay },
        scale:   { duration: 0.65, ease: EASE, delay },
        y:       { duration: 0.65, ease: EASE, delay },
      }}
    >
      <motion.div
        // Drift gently toward the centre orb, then ease away — a slow, smooth loop.
        animate={{ x: [0, localX, 0], y: [0, localY, 0] }}
        transition={{
          x: { duration: drift, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 },
          y: { duration: drift, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Floating raster card (Figma flattened image) with soft elevation shadow.
function FloatingImage({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <img
      src={src}
      alt=""
      width={w}
      height={h}
      draggable={false}
      className="block select-none [filter:drop-shadow(0_14px_28px_rgba(16,24,40,0.14))]"
      style={{ width: w, height: h }}
    />
  );
}

// ── Panel cards ───────────────────────────────────────────────────────────────

// Panel — Lesson status dropdown: Draft / Publish / Lock / Drip (160px wide)
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

// Individual floating photo card — positioned by pixel offset from viewport centre.
// Outer handles entry; inner handles the continuous float so they don't conflict.
function LearnFloatingCard({
  src,
  w,
  h,
  x,
  y,
  rotate,
  delay,
  initialY,
}: {
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  rotate: number;
  delay: number;
  initialY: number;
}) {
  // Pull a fraction of the way toward centre (0,0), so farther cards travel more — a
  // subtle parallax depth. Counter-rotate so the drift stays true toward centre.
  const PULL = 0.13;
  const rad = (rotate * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const pullX = -x * PULL;
  const pullY = -y * PULL;
  const localX = pullX * cos + pullY * sin;
  const localY = -pullX * sin + pullY * cos;
  const drift = 7 + delay * 5;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x - w / 2}px)`,
        top: `calc(50% + ${y - h / 2}px)`,
        rotate,
      }}
      initial={{ opacity: 0, scale: 0.88, y: initialY }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.55, ease: "easeOut", delay },
        scale:   { duration: 0.65, ease: EASE, delay },
        y:       { duration: 0.65, ease: EASE, delay },
      }}
    >
      <motion.div
        // Drift gently toward the centre orb, then ease away — a slow, smooth loop.
        animate={{ x: [0, localX, 0], y: [0, localY, 0] }}
        transition={{
          x: { duration: drift, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 },
          y: { duration: drift, repeat: Infinity, ease: "easeInOut", delay: delay + 0.7 },
        }}
      >
        <div
          className="overflow-hidden rounded-xl shadow-[0_18px_40px_rgba(16,24,40,0.16)] ring-1 ring-black/5"
          style={{ width: w, height: h }}
        >
          <img src={src} alt="" className="size-full object-cover" draggable={false} />
        </div>
      </motion.div>
    </motion.div>
  );
}
