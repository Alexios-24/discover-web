"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/sections/app-header";
import { BookIcon, RocketIcon, type GhlIconComponent } from "@/components/icons/ghl-icons";

const DURATION_MS = 3800;
const EASE = [0.22, 0.85, 0.25, 1] as const;

type PersonalizingMode = "create" | "learn";

interface FigmaFrame {
  width: number;
  height: number;
  maxWidth: string;
  center: {
    x: number;
    y: number;
    width: number;
  };
}

interface FigmaFloatingAsset {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  transparentOffsetX: number;
  transparentOffsetY: number;
  delay: number;
  initialY: number;
}

const ASSET_BASE = "/onboarding-personalizing";

// Figma nodes:
// - Launch/create flow: 3010:30175, 735.88 x 564.71
// - Discover/learn flow: 3010:30176, 1182 x 571
const FIGMA_FRAMES = {
  create: {
    width: 735.88,
    height: 564.71,
    maxWidth: "min(86vw, 735.88px, calc((100vh - 116px) * 1.303))",
    center: { x: 58.82, y: 95.97, width: 630 },
  },
  learn: {
    width: 1182,
    height: 571,
    maxWidth: "min(90vw, 1182px, calc((100vh - 116px) * 2.07))",
    center: { x: 283, y: 152.75, width: 630 },
  },
} satisfies Record<PersonalizingMode, FigmaFrame>;

// The PNGs are Figma-rendered individual nodes at 2x. width/height are the CSS
// size of each exported image, while transparentOffset* aligns the visible node
// bounds back to the frame coordinates from the Figma payload.
const LAUNCH_FLOATING_ASSETS: FigmaFloatingAsset[] = [
  {
    src: `${ASSET_BASE}/launch-course-card.png`,
    x: 0,
    y: 0,
    width: 312,
    height: 268.5,
    transparentOffsetX: 40,
    transparentOffsetY: 28,
    delay: 0.08,
    initialY: -20,
  },
  {
    src: `${ASSET_BASE}/launch-channels-card.png`,
    x: 535.68,
    y: 40.43,
    width: 210.5,
    height: 217.5,
    transparentOffsetX: 39.5,
    transparentOffsetY: 27.5,
    delay: 0.14,
    initialY: -20,
  },
  {
    src: `${ASSET_BASE}/launch-status-dropdown.png`,
    x: 40.62,
    y: 379.97,
    width: 253,
    height: 232.5,
    transparentOffsetX: 40,
    transparentOffsetY: 28,
    delay: 0.2,
    initialY: 20,
  },
  {
    src: `${ASSET_BASE}/launch-thumbnail-card.png`,
    x: 512.56,
    y: 366.79,
    width: 299.5,
    height: 274,
    transparentOffsetX: 40,
    transparentOffsetY: 28,
    delay: 0.26,
    initialY: 20,
  },
];

const DISCOVER_FLOATING_ASSETS: FigmaFloatingAsset[] = [
  {
    src: `${ASSET_BASE}/discover-card-top.png`,
    x: 465,
    y: 9.8,
    width: 151.5,
    height: 97,
    scale: 1.75,
    transparentOffsetX: 1,
    transparentOffsetY: 9.5,
    delay: 0.08,
    initialY: -20,
  },
  {
    src: `${ASSET_BASE}/discover-card-left.png`,
    x: 233.76,
    y: 202.61,
    width: 137.5,
    height: 89.5,
    scale: 1.75,
    transparentOffsetX: 1,
    transparentOffsetY: 10,
    delay: 0.12,
    initialY: -15,
  },
  {
    src: `${ASSET_BASE}/discover-card-right.png`,
    x: 827.31,
    y: 156.64,
    width: 139,
    height: 99.5,
    scale: 1.75,
    transparentOffsetX: 8.5,
    transparentOffsetY: 1.5,
    delay: 0.16,
    initialY: -18,
  },
  {
    src: `${ASSET_BASE}/discover-card-bottom-left.png`,
    x: 339.2,
    y: 495.17,
    width: 117,
    height: 81.5,
    scale: 1.75,
    transparentOffsetX: 1.5,
    transparentOffsetY: 8.5,
    delay: 0.2,
    initialY: 20,
  },
  {
    src: `${ASSET_BASE}/discover-card-bottom-right.png`,
    x: 844.03,
    y: 468.59,
    width: 137.5,
    height: 94.5,
    scale: 1.75,
    transparentOffsetX: 5.5,
    transparentOffsetY: 1,
    delay: 0.24,
    initialY: 20,
  },
];

function PersonalizingScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") === "learn" ? "learn" : "create";
  const choice = searchParams.get("choice");
  const domainsParam = searchParams.get("domains") ?? "";
  const fromHandoff = searchParams.get("handoff") === "1";

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
      <AppHeader variant="minimal" />
      {intent === "create" ? (
        <CreatePersonalizing
          phrases={phrases}
          phraseIndex={phraseIndex}
          fromHandoff={fromHandoff}
        />
      ) : (
        <LearnPersonalizing
          phrases={phrases}
          phraseIndex={phraseIndex}
          fromHandoff={fromHandoff}
        />
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

function CreatePersonalizing({
  phrases,
  phraseIndex,
  fromHandoff,
}: {
  phrases: string[];
  phraseIndex: number;
  fromHandoff: boolean;
}) {
  return (
    <PersonalizingStage
      mode="create"
      phrases={phrases}
      phraseIndex={phraseIndex}
      fromHandoff={fromHandoff}
    />
  );
}

function LearnPersonalizing({
  phrases,
  phraseIndex,
  fromHandoff,
}: {
  phrases: string[];
  phraseIndex: number;
  fromHandoff: boolean;
}) {
  return (
    <PersonalizingStage
      mode="learn"
      phrases={phrases}
      phraseIndex={phraseIndex}
      fromHandoff={fromHandoff}
    />
  );
}

function PersonalizingStage({
  mode,
  phrases,
  phraseIndex,
  fromHandoff,
}: {
  mode: PersonalizingMode;
  phrases: string[];
  phraseIndex: number;
  fromHandoff: boolean;
}) {
  const frame = FIGMA_FRAMES[mode];
  const assets =
    mode === "create" ? LAUNCH_FLOATING_ASSETS : DISCOVER_FLOATING_ASSETS;
  const Glyph = mode === "create" ? RocketIcon : BookIcon;

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 max-md:py-8">
      <div
        className="relative min-w-[300px]"
        style={{
          width: frame.maxWidth,
          aspectRatio: `${frame.width} / ${frame.height}`,
          containerType: "inline-size",
        }}
      >
        {assets.map((asset) => (
          <FigmaFloatingAsset
            key={asset.src}
            asset={asset}
            frame={frame}
          />
        ))}

        <CentralPersonalizingContent
          frame={frame}
          glyph={Glyph}
          heading={
            mode === "create"
              ? "Personalizing your workspace"
              : "Personalizing your experience"
          }
          phrases={phrases}
          phraseIndex={phraseIndex}
          gradientId={`${mode}-arc-grad`}
          fromHandoff={fromHandoff}
        />
      </div>
    </div>
  );
}

function FigmaFloatingAsset({
  asset,
  frame,
}: {
  asset: FigmaFloatingAsset;
  frame: FigmaFrame;
}) {
  const scale = asset.scale ?? 1;
  const scaledWidth = asset.width * scale;
  const scaledHeight = asset.height * scale;
  const visibleCenterX = asset.x + asset.width / 2;
  const visibleCenterY = asset.y + asset.height / 2;
  const horizontalDirection = visibleCenterX < frame.width / 2 ? -1 : 1;
  const verticalDirection = visibleCenterY < frame.height / 2 ? -1 : 1;

  return (
    <motion.div
      className="absolute max-sm:hidden"
      style={{
        left: `${
          ((asset.x - asset.transparentOffsetX - (scaledWidth - asset.width) / 2) /
            frame.width) *
          100
        }%`,
        top: `${
          ((asset.y - asset.transparentOffsetY - (scaledHeight - asset.height) / 2) /
            frame.height) *
          100
        }%`,
        width: `${(scaledWidth / frame.width) * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0.9, y: asset.initialY }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.55, ease: "easeOut", delay: asset.delay },
        scale: { duration: 0.65, ease: EASE, delay: asset.delay },
        y: { duration: 0.65, ease: EASE, delay: asset.delay },
      }}
    >
      <motion.img
        src={asset.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="block h-auto w-full select-none will-change-transform"
        animate={{
          x: [0, horizontalDirection * 16, 0],
          y: [0, verticalDirection * 18, 0],
          rotate: [0, horizontalDirection * 2.4, 0],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 2.8 + asset.delay * 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: asset.delay + 0.35,
          times: [0, 0.5, 1],
        }}
      />
    </motion.div>
  );
}

function CentralPersonalizingContent({
  frame,
  glyph,
  heading,
  phrases,
  phraseIndex,
  gradientId,
  fromHandoff,
}: {
  frame: FigmaFrame;
  glyph: GhlIconComponent;
  heading: string;
  phrases: string[];
  phraseIndex: number;
  gradientId: string;
  fromHandoff: boolean;
}) {
  return (
    <div
      className="absolute z-10 flex flex-col items-center text-center max-sm:!left-1/2 max-sm:!top-1/2 max-sm:!w-[90vw] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2"
      style={{
        left: `${(frame.center.x / frame.width) * 100}%`,
        top: `${(frame.center.y / frame.height) * 100}%`,
        width: `${(frame.center.width / frame.width) * 100}%`,
        gap: `clamp(18px, ${(24 / frame.width) * 100}cqw, 24px)`,
      }}
    >
      <motion.div
        className="flex w-full flex-col items-center text-center"
        style={{
          gap: `clamp(18px, ${(24 / frame.width) * 100}cqw, 24px)`,
        }}
        initial={fromHandoff ? { opacity: 0.94, scale: 0.995 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.36, ease: EASE }}
      >
        <PersonalizingOrb
          glyph={glyph}
          gradientId={gradientId}
          frameWidth={frame.width}
        />
        <div className="flex w-full flex-col items-center gap-2">
          <h1
            className="whitespace-nowrap font-montserrat font-bold leading-normal text-[#101828] max-sm:whitespace-normal"
            style={{
              fontSize: `clamp(28px, ${(40 / frame.width) * 100}cqw, 40px)`,
            }}
          >
            {heading}
          </h1>
          <div
            className="overflow-hidden bg-white"
            style={{
              width: `clamp(280px, ${(354 / frame.width) * 100}cqw, 354px)`,
              height: `clamp(24px, ${(28 / frame.width) * 100}cqw, 28px)`,
            }}
          >
            <motion.div
              className="flex flex-col"
              style={{ gap: 16 }}
              animate={{ y: -(phraseIndex * 44) }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {phrases.map((phrase) => (
                <p
                  key={phrase}
                  className="shrink-0 text-center leading-7 text-[#475467]"
                  style={{
                    fontSize: `clamp(15px, ${(18 / frame.width) * 100}cqw, 18px)`,
                  }}
                >
                  {phrase}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PersonalizingOrb({
  glyph: Glyph,
  gradientId,
  frameWidth,
}: {
  glyph: GhlIconComponent;
  gradientId: string;
  frameWidth: number;
}) {
  const R = 81;
  const C = 2 * Math.PI * R;
  const arcLen = +(C * 0.78).toFixed(1);
  const gapLen = +(C - arcLen).toFixed(1);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `clamp(132px, ${(171.5 / frameWidth) * 100}cqw, 171.5px)`,
        aspectRatio: "1 / 1",
      }}
    >
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
              id={gradientId}
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
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${gapLen}`}
          />
        </svg>
      </motion.div>

      <div
        className="relative z-10 flex items-center justify-center rounded-full text-white"
        style={{
          width: "69.97%",
          aspectRatio: "1 / 1",
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
          <Glyph size={48} />
        </span>
      </div>
    </div>
  );
}
