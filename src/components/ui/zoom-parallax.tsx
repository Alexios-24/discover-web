"use client";

import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface ParallaxCard {
  /**
   * Renders card content. Receives the parent scale motion value so the
   * card content can counter-scale internal labels to keep them at a
   * constant pixel size while the image scales up.
   */
  content: (parentScale: MotionValue<number>) => ReactNode;
  /** CSS classes applied to motion.div; can target inner [&>div] for size/position */
  positionClass: string;
  /** Max scale factor reached at end of scroll */
  scale: number;
}

interface ZoomParallaxProps {
  cards: ParallaxCard[];
  /**
   * Optional alternative card set used on viewports narrower than
   * MOBILE_BREAKPOINT_PX. Positions/scales are tuned independently of the
   * desktop layout (typically: cards in their final Figma vw sizes with
   * fixed layoutScale = 1).
   */
  mobileCards?: ParallaxCard[];
  /**
   * Center-card width in vw on desktop (used to size the overlay anchor).
   * Defaults to 18 (the original base width).
   */
  centerCardWidthVw?: number;
  /** Same as `centerCardWidthVw`, used when the mobile card set is active. */
  mobileCenterCardWidthVw?: number;
  /** Optional overlay that fades in once the centre card has filled the viewport */
  overlay?: ReactNode;
}

// F1 above-centre extent = 14.75vw + 16.73vw/2 = 23.115vw
const F1_EXTENT_VW = 0.23115;
const HEADING_GAP_PX = 32; // F1 top → sticky top gap (matches mb-8 in sibling sections)
const TEXT_GAP_PX = 24; // overlay text bottom → Kollabers card top gap
const MIN_LAYOUT_SCALE = 0.45;
// On mobile we keep the constellation at exact Figma vw values, so the
// scale is fixed to 1 instead of being computed from F1's extent.
const MOBILE_FIXED_LAYOUT_SCALE = 1.0;
const MOBILE_BREAKPOINT_PX = 768;
// On mobile the constellation is naturally vertically centered inside the
// h-screen sticky layer, which leaves a large empty band between the
// "Featured products" heading and the top-most card (F1). Shifting the
// whole cards layer upward by this amount closes that gap. The overlay
// "official community of Kollab" position is offset by the same value
// so it continues to track the Kollabers card during the zoom transition.
// Desktop layout is unaffected (shift is only applied when isMobile=true).
const MOBILE_VERTICAL_SHIFT_PX = 120;

export function ZoomParallax({
  cards: desktopCards,
  mobileCards,
  centerCardWidthVw = 18,
  mobileCenterCardWidthVw = 18,
  overlay,
}: ZoomParallaxProps) {
  // SSR-safe: render desktop layout on the server, switch after hydration.
  // Mobile detection must run client-side because window is unavailable
  // during SSR and we don't want a hydration mismatch.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const cards = isMobile && mobileCards ? mobileCards : desktopCards;
  const activeCenterWidthVw = isMobile && mobileCards
    ? mobileCenterCardWidthVw
    : centerCardWidthVw;
  // Half-height in vw fraction: width × 9/16 / 2 / 100.
  const centerHalfHVwFraction = (activeCenterWidthVw * (9 / 16)) / 2 / 100;
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const s0 = useTransform(scrollYProgress, [0, 1], [1, cards[0]?.scale ?? 4]);
  const s1 = useTransform(scrollYProgress, [0, 1], [1, cards[1]?.scale ?? 5]);
  const s2 = useTransform(scrollYProgress, [0, 1], [1, cards[2]?.scale ?? 6]);
  const s3 = useTransform(scrollYProgress, [0, 1], [1, cards[3]?.scale ?? 5]);
  const s4 = useTransform(scrollYProgress, [0, 1], [1, cards[4]?.scale ?? 6]);
  const s5 = useTransform(scrollYProgress, [0, 1], [1, cards[5]?.scale ?? 8]);
  const s6 = useTransform(scrollYProgress, [0, 1], [1, cards[6]?.scale ?? 9]);
  const scales: MotionValue<number>[] = [s0, s1, s2, s3, s4, s5, s6];

  const centerMaxScale = cards[0]?.scale ?? 2.5;

  const [layoutScale, setLayoutScale] = useState(1);
  const layoutScaleRef = useRef(1);
  const [verticalShiftPx, setVerticalShiftPx] = useState(0);
  const verticalShiftRef = useRef(0);
  const cardsLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    [-verticalShiftPx, 0],
  );
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0, topPx: 0 });

  useEffect(() => {
    function updateLayout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobileNow = w < MOBILE_BREAKPOINT_PX;

      let s: number;
      let shift: number;
      if (isMobileNow && mobileCards) {
        // Mobile layout: positions/sizes are already in their target vw
        // values, so no extra scaling is required.
        s = MOBILE_FIXED_LAYOUT_SCALE;
        // Pull the constellation upward so the cards sit closer to the
        // "Featured products" heading instead of being centered in h-screen.
        shift = MOBILE_VERTICAL_SHIFT_PX;
      } else {
        s = Math.max(
          MIN_LAYOUT_SCALE,
          (h * 0.5 - HEADING_GAP_PX) / (w * F1_EXTENT_VW),
        );
        shift = 0;
      }
      layoutScaleRef.current = s;
      verticalShiftRef.current = shift;
      setLayoutScale(s);
      setVerticalShiftPx(shift);
    }

    function update() {
      const el = container.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));

      const opacity = Math.max(0, Math.min(1, (p - 0.6) / 0.25));

      // Centre card's ACTUAL top edge at the current scroll progress.
      // The card scales from 1→centerMaxScale over progress 0→1.
      // Visual half-height = base × scrollScale × layoutScale.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const L = layoutScaleRef.current;
      const shift = verticalShiftRef.current;
      const scrollScale = 1 + (centerMaxScale - 1) * p;
      const cardHalfH = centerHalfHVwFraction * w * scrollScale * L;
      // Mobile starts shifted upward to preserve the tight header gap, then
      // eases back to true centre so Kollabers finishes centered in viewport.
      const activeShift = shift * (1 - p);
      const cardTop = h / 2 - cardHalfH - activeShift;

      // Overlay bottom sits TEXT_GAP_PX above card top.
      // translateY(-100%) in the JSX makes `topPx` act as the bottom edge.
      setOverlayStyle({ opacity, topPx: cardTop - TEXT_GAP_PX });
    }

    updateLayout();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("resize", updateLayout);
    };
  }, [centerMaxScale, mobileCards, centerHalfHVwFraction]);

  return (
    <div ref={container} className="relative h-[220vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen">
        {/* Cards layer — uniformly scaled so F1's top is always HEADING_GAP_PX below sticky-top */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              y: cardsLayerY,
              scale: layoutScale,
              transformOrigin: "center center",
            }}
          >
            {cards.map((card, i) => {
              const scale = scales[i % scales.length];
              return (
                <motion.div
                  key={i}
                  style={{ scale }}
                  className={`pointer-events-none absolute top-0 flex h-full w-full items-center justify-center ${card.positionClass}`}
                >
                  <div className="pointer-events-auto relative w-[18vw] aspect-[16/9]">
                    {card.content(scale)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Overlay: bottom-anchored TEXT_GAP_PX above Kollabers' actual top edge at every scroll frame */}
        {overlay && (
          <div
            style={{
              opacity: overlayStyle.opacity,
              transform: "translateY(-100%)",
              top: `${overlayStyle.topPx}px`,
            }}
            className="absolute inset-x-0 z-[100] flex items-center justify-center px-6 pointer-events-none"
          >
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
}
