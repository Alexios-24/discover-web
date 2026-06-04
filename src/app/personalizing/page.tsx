"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Rocket } from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";

// Premium "personalizing your experience" interstitial.
// Flow A (intent=create) → minimal header (Figma 2940:30669), then → /workspace.
// Flow B (intent=learn)  → full logged-in header (Figma 2948:29350), then → /picks.
// Both render a polished assembly animation on the blank white canvas the
// designs specify, tuned to the onboarding orb aesthetic and the #343DE5 brand.

const DURATION_MS = 3800;

// Thumbnails that "assemble" into the personalized layout around the orb.
const TILES = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=240&h=160&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=240&h=160&auto=format&fit=crop&q=60",
];

// Resting positions for the six tiles, fanned symmetrically around the orb.
const TILE_LAYOUT = [
  { x: -226, y: -86, rotate: -10, w: 116, h: 80 },
  { x: 226, y: -70, rotate: 9, w: 116, h: 80 },
  { x: -250, y: 84, rotate: 8, w: 116, h: 80 },
  { x: 250, y: 96, rotate: -8, w: 116, h: 80 },
  { x: -120, y: 168, rotate: -5, w: 104, h: 72 },
  { x: 130, y: 176, rotate: 6, w: 104, h: 72 },
];

const EASE = [0.22, 0.85, 0.25, 1] as const;

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

  // Advance the status copy in step with the progress bar.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhraseIndex((index) => Math.min(index + 1, phrases.length - 1));
    }, DURATION_MS / phrases.length);
    return () => window.clearInterval(interval);
  }, [phrases.length]);

  // Hand off to the destination screen once the animation completes. We replace
  // (not push) so the browser Back button never returns to this interstitial.
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
                    scale: {
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.15 + index * 0.1,
                    },
                    x: {
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.15 + index * 0.1,
                    },
                    rotate: {
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.15 + index * 0.1,
                    },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.85 + index * 0.1,
                    },
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

            {/* Orbiting ring + glass core */}
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
