"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Rocket } from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";

// Premium "personalizing your experience" interstitial.
// Flow A (intent=create) → minimal header (Figma 2940:30669), then → /workspace.
// Flow B (intent=learn)  → full logged-in header (Figma 2948:29350), then → /picks.
//
// The two flows share the orb, copy, and progress bar but use distinct
// surrounding animations:
//   Discover (learn)  → scattered photo tiles assembling from center
//   Launch   (create) → flat creation-UI cards sliding in from sides:
//                       course outline, page preview, content editor,
//                       media encoding, community spaces, publish checklist.

const DURATION_MS = 3800;

// ── Discover path ─────────────────────────────────────────────────────────────

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

// ── Launch path ───────────────────────────────────────────────────────────────
//
// Six flat creation-UI cards positioned symmetrically around the orb.
// They slide in from their respective sides — left cards from left, right from
// right — conveying a workspace being assembled panel by panel.

const WORKSPACE_LAYOUT = [
  { x: -234, y: -108, w: 134, h: 80 },  // top-left  – course outline
  { x:  234, y: -108, w: 134, h: 80 },  // top-right – page preview
  { x: -246, y:   26, w: 122, h: 66 },  // mid-left  – content editor
  { x:  246, y:   26, w: 122, h: 66 },  // mid-right – media encoding
  { x: -234, y:  146, w: 134, h: 56 },  // btm-left  – community spaces
  { x:  234, y:  146, w: 134, h: 56 },  // btm-right – publish checklist
] as const;

const EASE = [0.22, 0.85, 0.25, 1] as const;

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
        : [
            "Setting up your workspace",
            "Adding starter content",
            "Polishing the details",
            "Almost ready",
          ],
    [intent],
  );

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((index) => Math.min(index + 1, phrases.length - 1));
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

  const Glyph = intent === "learn" ? BookOpen : Rocket;
  const heading =
    intent === "learn"
      ? "Personalizing your experience"
      : "Personalizing your workspace";

  return (
    <main className="relative flex min-h-screen flex-col bg-white text-gray-900">
      <AppHeader variant={intent === "learn" ? "full" : "minimal"} />

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

            {intent === "create" ? (
              WORKSPACE_LAYOUT.map((spot, index) => (
                <WorkspaceCard key={index} index={index} spot={spot} />
              ))
            ) : (
              TILES.map((src, index) => {
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
                      scale: { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                      x: { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                      rotate: { duration: 0.7, ease: EASE, delay: 0.15 + index * 0.1 },
                      y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.85 + index * 0.1,
                      },
                    }}
                  >
                    <img src={src} alt="" className="size-full object-cover" draggable={false} />
                  </motion.div>
                );
              })
            )}

            {/* Orbiting ring + glass core — shared between both flows */}
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
                <AnimatePresence mode="wait">
                  <motion.span
                    key={intent}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    className="relative"
                  >
                    <Glyph size={40} strokeWidth={1.85} />
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Copy + progress */}
          <div className="mt-10 flex w-[360px] max-w-[88vw] flex-col items-center text-center">
            <h1 className="font-montserrat text-[28px] font-bold leading-9 tracking-[-0.5px] text-gray-900 sm:text-[32px]">
              {heading}
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

// ── Launch flow: creation-UI card components ──────────────────────────────────

type WorkspaceSpot = (typeof WORKSPACE_LAYOUT)[number];

// Left-side cards slide from further left, right-side cards from further right.
// All cards are flat (zero rotation), ±2 px idle float — grounded and structured.
function WorkspaceCard({
  index,
  spot,
}: {
  index: number;
  spot: WorkspaceSpot;
}) {
  const entryDelay = 0.18 + index * 0.09;
  const initialX = spot.x * 1.5;

  return (
    <motion.div
      className="absolute overflow-hidden rounded-xl bg-white shadow-[0_12px_32px_rgba(16,24,40,0.11)] ring-1 ring-black/[0.06]"
      style={{ width: spot.w, height: spot.h }}
      initial={{ x: initialX, y: spot.y, opacity: 0, scale: 0.88 }}
      animate={{
        x: spot.x,
        y: [spot.y - 2, spot.y + 2, spot.y - 2],
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.42, delay: entryDelay },
        scale: { duration: 0.58, ease: EASE, delay: entryDelay },
        x: { duration: 0.58, ease: EASE, delay: entryDelay },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: entryDelay + 0.62,
        },
      }}
    >
      <WorkspaceCardContent index={index} />
    </motion.div>
  );
}

function WorkspaceCardContent({ index }: { index: number }) {
  switch (index) {
    case 0: return <OutlineCard />;
    case 1: return <PagePreviewCard />;
    case 2: return <EditorCard />;
    case 3: return <MediaCard />;
    case 4: return <SpacesCard />;
    case 5: return <ChecklistCard />;
    default: return null;
  }
}

// Card 0 – top-left: course outline being written. Module 2 has a blinking
// cursor to show the structure is still being generated.
function OutlineCard() {
  return (
    <div className="flex h-full flex-col p-3">
      <span className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#343DE5]">
        Outline
      </span>
      <div className="flex flex-col gap-[3px]">
        <div className="flex items-center gap-1 text-[8px] font-semibold text-gray-700">
          <span className="w-3 text-gray-400">1.</span>
          Module 1
        </div>
        <div className="ml-3 flex items-center gap-1 text-[7.5px] text-gray-500">
          <span className="w-2.5 text-gray-300">├</span>
          Lesson 1
        </div>
        <div className="ml-3 flex items-center gap-1 text-[7.5px] text-gray-500">
          <span className="w-2.5 text-gray-300">└</span>
          Lesson 2
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[8px] font-semibold text-gray-700">
          <span className="w-3 text-gray-400">2.</span>
          Module 2
          <motion.span
            aria-hidden
            className="ml-px inline-block h-[9px] w-[1.5px] translate-y-[1px] rounded-[1px] bg-[#343DE5]"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95], ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

// Card 1 – top-right: miniature course landing page being generated.
// Cover gradient → course name → category badge → enroll CTA.
function PagePreviewCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        className="h-[26px] w-full shrink-0"
        style={{ background: "linear-gradient(120deg, #343DE5 0%, #7C3AED 100%)" }}
      />
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <div>
          <p className="text-[9px] font-semibold leading-tight text-gray-900">
            Your course
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="rounded bg-[#ecfdf3] px-1 py-px text-[7px] font-semibold text-emerald-700">
              Free
            </span>
            <span className="rounded border border-gray-200 px-1 py-px text-[7px] font-medium text-gray-500">
              Finance
            </span>
          </div>
        </div>
        <div className="flex h-[18px] w-full items-center justify-center rounded bg-[#343DE5]">
          <span className="text-[7.5px] font-semibold text-white">Enroll now →</span>
        </div>
      </div>
    </div>
  );
}

// Card 2 – mid-left: lesson content editor with text appearing mid-sentence
// and a blinking cursor signalling active drafting.
function EditorCard() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[9px] font-semibold text-gray-700">Lesson 1</span>
        <span className="rounded bg-[#eff0fd] px-1 py-px text-[7px] font-semibold text-[#343DE5]">
          Intro
        </span>
      </div>
      <div className="h-px w-full bg-gray-100" />
      <div className="mt-1.5 flex-1">
        <p className="text-[8px] leading-[14px] text-gray-700">
          Welcome! In this lesson
          <motion.span
            aria-hidden
            className="ml-px inline-block h-[9px] w-[1.5px] translate-y-[1px] rounded-[1px] bg-[#343DE5]"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95], ease: "linear" }}
          />
        </p>
        <div className="mt-1.5 h-[4px] w-2/3 rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

// Card 3 – mid-right: intro video being encoded. The progress bar animates
// across the full duration of the personalizing screen.
function MediaCard() {
  return (
    <div className="flex h-full flex-col justify-between p-2.5">
      <div className="flex items-center gap-1.5">
        <span className="flex size-[14px] shrink-0 items-center justify-center rounded-sm bg-[#eff0fd]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M2 1.5L6.5 4L2 6.5V1.5Z" fill="#343DE5" />
          </svg>
        </span>
        <span className="text-[9px] font-medium text-gray-700">Intro video</span>
      </div>
      <div>
        <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-[#343DE5]"
            initial={{ width: "36%" }}
            animate={{ width: "93%" }}
            transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <p className="mt-1 text-[7.5px] text-gray-400">Encoding…</p>
      </div>
    </div>
  );
}

// Card 4 – bottom-left: community channels being created, each with a green
// "live" dot once it comes online.
function SpacesCard() {
  return (
    <div className="flex h-full flex-col justify-between p-2.5">
      <span className="text-[7.5px] font-semibold uppercase tracking-[0.06em] text-gray-400">
        Spaces
      </span>
      <div className="flex flex-col gap-[5px]">
        {["general", "resources"].map((ch) => (
          <div key={ch} className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-gray-400">#</span>
            <span className="flex-1 text-[8px] text-gray-700">{ch}</span>
            <span className="size-[6px] rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Card 5 – bottom-right: publish checklist. Two items complete, "Going live"
// is still in progress with a blinking cursor.
function ChecklistCard() {
  return (
    <div className="flex h-full flex-col justify-between p-2.5">
      <span className="text-[7.5px] font-semibold uppercase tracking-[0.06em] text-gray-400">
        Setup
      </span>
      <div className="flex flex-col gap-[5px]">
        {["Draft saved", "Page ready"].map((item) => (
          <div key={item} className="flex items-center gap-1.5">
            <CheckDot />
            <span className="text-[8px] text-gray-700">{item}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 shrink-0 rounded-full border-[1.5px] border-[#343DE5]" />
          <span className="text-[8px] text-[#343DE5]">
            Going live
            <motion.span
              aria-hidden
              className="ml-px inline-block h-[9px] w-[1.5px] translate-y-[1px] rounded-[1px] bg-[#343DE5]"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95], ease: "linear" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckDot() {
  return (
    <span className="flex size-2.5 shrink-0 items-center justify-center rounded-full bg-[#343DE5]">
      <svg width="5" height="5" viewBox="0 0 7 7" fill="none" aria-hidden>
        <path
          d="M1.5 3.5L3 5L5.5 2"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
