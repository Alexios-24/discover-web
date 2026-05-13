"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { type MotionValue } from "framer-motion";
import { ZoomParallax, type ParallaxCard } from "@/components/ui/zoom-parallax";
import { CursorTooltip } from "@/components/ui/animated-tooltip";

interface ProductCard {
  title: string;
  pricing: string;
  members: string;
  image: string;
  gradientTo: string;
}

const CARDS: ProductCard[] = [
  {
    title: "Kollabers",
    pricing: "Free",
    members: "3.1K members",
    image: "/kollabers-cover.png",
    gradientTo: "#011016",
  },
  {
    title: "F1 enthusiasts",
    pricing: "Free",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=700&auto=format&fit=crop&q=80",
    gradientTo: "#393a3c",
  },
  {
    title: "Understanding gaming industry",
    pricing: "$ 99/month",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    title: "How to read books effectively",
    pricing: "Free",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    title: "Understanding human psychology",
    pricing: "Free",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    title: "Red dead redemption",
    pricing: "Free",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    title: "PS5 officials",
    pricing: "Free",
    members: "27.4K members",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
];

function CardContent({
  card,
  parentScale,
  showTooltip = false,
}: {
  card: ProductCard;
  parentScale: MotionValue<number>;
  showTooltip?: boolean;
}) {
  const isGlobe = card.pricing === "Free";

  const [scale, setScale] = useState(1);
  useEffect(() => {
    setScale(parentScale.get());
    const unsub = parentScale.on("change", setScale);
    return unsub;
  }, [parentScale]);

  // Detect mobile so we can opt-out of the inverse-scale compensation and
  // use Figma-spec values for radius and inner content size.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const inverseScale = 1 / Math.max(scale, 0.001);
  // Desktop keeps the radius visually constant via inverseScale compensation.
  // Mobile follows Figma: 9.089px at default (191×107 card) which scales up
  // to ~18px at the zoomed-in state (380×214) — i.e. radius grows with the
  // card, so we use a static value rather than counter-scaling.
  const dynamicRadius = isMobile ? 9.089 : 16 * inverseScale;
  // Mobile content stays anchored to the card's footprint, so we drop the
  // inverseScale counter-scale that desktop uses to keep content at constant
  // visual size as the whole card zooms. On mobile the text grows naturally
  // with the card, matching the Figma transition from default → scrolled.
  const contentInverseScale = isMobile ? 1 : inverseScale;
  const contentWidthPct = isMobile ? 100 : scale * 100;

  const tooltipEnabled = showTooltip && scale > 1.5;

  const inner = (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer [transform:translateZ(0)]"
      style={{ borderRadius: `${dynamicRadius}px` }}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div
        style={{
          transform: `scale(${contentInverseScale})`,
          transformOrigin: "left bottom",
          width: `${contentWidthPct}%`,
        }}
        className="absolute bottom-0 left-0"
      >
        <div
          className="flex items-end p-4 max-md:p-[9.089px]"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${card.gradientTo}80 47.77%, ${card.gradientTo} 100%)`,
          }}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2 max-md:gap-[9.06px]">
            <h3 className="text-[18px] leading-[28px] font-semibold text-white font-inter truncate max-md:text-[12px] max-md:leading-[16px]">
              {card.title}
            </h3>
            <div className="flex items-center gap-[6px] whitespace-nowrap max-md:gap-[8px]">
              <span className="flex items-center gap-[2px] h-6 px-2 rounded-[12px] bg-white/25 shrink-0 max-md:h-[13.6px] max-md:px-[4.5px] max-md:rounded-[12px]">
                {isGlobe && <Globe size={16} className="text-white max-md:size-[9px]" />}
                <span className="text-[13px] leading-[18px] font-medium text-white font-inter max-md:text-[7.4px] max-md:leading-[10.2px]">
                  {card.pricing}
                </span>
              </span>
              <span className="size-[6px] rounded-full bg-white/60 shrink-0 max-md:size-[3.4px]" />
              <span className="text-[14px] leading-[18px] text-[#EAECF0] font-inter shrink-0 max-md:text-[9px] max-md:leading-[13.6px]">
                {card.members}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showTooltip) {
    return (
      <CursorTooltip label="Join now" enabled={tooltipEnabled}>
        {inner}
      </CursorTooltip>
    );
  }

  return inner;
}

/*
 * Layout precisely derived from Figma frame 1994:45612 (1332×814 canvas).
 * Each card's center offset from Kollabers center is converted to vw using:
 *   scale = 18vw / 391px (Kollabers default width) ≈ 0.04604 vw/px
 *
 * In ZoomParallax the inner div is flex-centered with default w=18vw aspect-[16/9].
 * `[&>div]:!top-[X]` and `[&>div]:!left-[X]` shift the centered div by X (relative).
 * `[&>div]:!w-[X]` overrides the width; height auto from aspect-[16/9].
 *
 * Verified: NO cards overlap. Smallest gap is ~1.25vw between adjacent cards.
 * All cards have 16:9 aspect ratio.
 *
 * Center max scale = 2.5 → 18vw × 2.5 = 45vw wide × 25.3vw tall.
 *   On 1440x900 viewport: 648px × 364px → ~40% viewport height,
 *   leaving ~30vh above the card for the "official community" header text.
 * Outer scales 5–7 → all outer cards exit viewport well before scroll end.
 */
const PARALLAX_CARDS: ParallaxCard[] = [
  // 0 — Kollabers (CENTRE: 470.5,392 size 391×220 in 1332×814 frame)
  {
    content: (s) => <CardContent card={CARDS[0]} parentScale={s} showTooltip />,
    positionClass: "[&>div]:!w-[18vw]",
    scale: 2.5,
  },
  // 1 — F1 enthusiasts (TOP-WIDE: 470.5,0 size 646×363)
  //     Δ = (127.5, -320.5) → (5.87vw, -14.75vw); w 646→29.74vw
  //     scale 9 → ensures card fully exits top of viewport on tall (vh > vw*0.75) viewports
  {
    content: (s) => <CardContent card={CARDS[1]} parentScale={s} />,
    positionClass: "[&>div]:!left-[5.87vw] [&>div]:!-top-[14.75vw] [&>div]:!w-[29.74vw]",
    scale: 9,
  },
  // 2 — Understanding gaming industry (LEFT-MIDDLE: 6.5,283 size 436×245)
  //     Δ = (-441.5, -96.5) → (-20.31vw, -4.44vw); w 436→20.07vw
  {
    content: (s) => <CardContent card={CARDS[2]} parentScale={s} />,
    positionClass: "[&>div]:!-left-[20.31vw] [&>div]:!-top-[4.44vw] [&>div]:!w-[20.07vw]",
    scale: 7,
  },
  // 3 — How to read books effectively (RIGHT-MIDDLE: 889.5,392 size 391×220)
  //     Δ = (419, 0) → (19.27vw, 0); w 391→18vw
  {
    content: (s) => <CardContent card={CARDS[3]} parentScale={s} />,
    positionClass: "[&>div]:!left-[19.27vw] [&>div]:!w-[18vw]",
    scale: 7,
  },
  // 4 — Understanding human psychology (BOTTOM-LEFT: 6.5,569 size 436×245)
  //     Δ = (-441.5, 189.5) → (-20.31vw, 8.72vw); w 436→20.07vw
  {
    content: (s) => <CardContent card={CARDS[4]} parentScale={s} />,
    positionClass: "[&>div]:!-left-[20.31vw] [&>div]:!top-[8.72vw] [&>div]:!w-[20.07vw]",
    scale: 7,
  },
  // 5 — Red dead redemption (BOTTOM-CENTRE-LEFT: 470,641 size 307.55×173)
  //     Δ = (-42.22, 225.5) → (-1.94vw, 10.37vw); w 307.55→14.16vw
  {
    content: (s) => <CardContent card={CARDS[5]} parentScale={s} />,
    positionClass: "[&>div]:!-left-[1.94vw] [&>div]:!top-[10.37vw] [&>div]:!w-[14.16vw]",
    scale: 9,
  },
  // 6 — PS5 officials (BOTTOM-CENTRE-RIGHT: 805,641 size 307.55×173)
  //     Δ = (292.78, 225.5) → (13.47vw, 10.37vw); w 307.55→14.16vw
  {
    content: (s) => <CardContent card={CARDS[6]} parentScale={s} />,
    positionClass: "[&>div]:!left-[13.47vw] [&>div]:!top-[10.37vw] [&>div]:!w-[14.16vw]",
    scale: 9,
  },
];

/*
 * Mobile layout — derived from Figma frame 2325:21458 (412×398 mosaic of
 * 7 cards). All deltas are computed relative to Kollabers's CENTER (so
 * Kollabers itself stays at viewport center on scroll), and widths/offsets
 * are converted to vw at the 412px design width.
 *
 *   Kollabers card  — 191×107, treated as the constellation centre.
 *   Kollabers scale — 2.0  (→ 92.7vw wide ≈ 382px at end of scroll, matching
 *                          Figma scrolled-state card 380.776×214.187).
 *   Other cards     — scaled 4–6 so they fly fully off-screen by the time
 *                     Kollabers fills the viewport.
 *
 * On a 412×850 phone, the default-state Kollabers ends up at viewport
 * center with the other 6 cards arranged in a tight mosaic around it,
 * matching the Figma "Featured products" default view.
 */
const MOBILE_PARALLAX_CARDS: ParallaxCard[] = [
  // 0 — Kollabers (CENTRE: 191×107, anchor for all other deltas)
  {
    content: (s) => <CardContent card={CARDS[0]} parentScale={s} showTooltip />,
    positionClass: "[&>div]:!w-[46.36vw]",
    scale: 2.0,
  },
  // 1 — F1 enthusiasts (TOP-RIGHT: 316×178, Δ = (62.5, -156.7) ≈ (15.17, -38.03)vw)
  {
    content: (s) => <CardContent card={CARDS[1]} parentScale={s} />,
    positionClass:
      "[&>div]:!left-[15.17vw] [&>div]:!-top-[38.03vw] [&>div]:!w-[76.7vw]",
    scale: 4,
  },
  // 2 — Understanding gaming industry (LEFT-TOP bleed: 211.6×119,
  //     Δ = (-216.7, -47.2) ≈ (-52.59, -11.46)vw)
  {
    content: (s) => <CardContent card={CARDS[2]} parentScale={s} />,
    positionClass:
      "[&>div]:!-left-[52.59vw] [&>div]:!-top-[11.46vw] [&>div]:!w-[51.35vw]",
    scale: 5,
  },
  // 3 — How to read books effectively (RIGHT-MIDDLE bleed: 191×107,
  //     Δ = (205, -0.2) ≈ (49.76, -0.05)vw)
  {
    content: (s) => <CardContent card={CARDS[3]} parentScale={s} />,
    positionClass:
      "[&>div]:!left-[49.76vw] [&>div]:!-top-[0.05vw] [&>div]:!w-[46.36vw]",
    scale: 5,
  },
  // 4 — Understanding human psychology (LEFT-BOTTOM bleed: 213×120,
  //     Δ = (-216, 92.3) ≈ (-52.43, 22.40)vw)
  {
    content: (s) => <CardContent card={CARDS[4]} parentScale={s} />,
    positionClass:
      "[&>div]:!-left-[52.43vw] [&>div]:!top-[22.40vw] [&>div]:!w-[51.7vw]",
    scale: 7,
  },
  // 5 — Red dead redemption (BOTTOM-CENTRE-LEFT: 150×84,
  //     Δ = (-20.5, 110.3) ≈ (-4.98, 26.77)vw)
  {
    content: (s) => <CardContent card={CARDS[5]} parentScale={s} />,
    positionClass:
      "[&>div]:!-left-[4.98vw] [&>div]:!top-[26.77vw] [&>div]:!w-[36.41vw]",
    scale: 9,
  },
  // 6 — PS5 officials (BOTTOM-CENTRE-RIGHT: 149.3×84,
  //     Δ = (142.2, 110.3) ≈ (34.51, 26.77)vw)
  {
    content: (s) => <CardContent card={CARDS[6]} parentScale={s} />,
    positionClass:
      "[&>div]:!left-[34.51vw] [&>div]:!top-[26.77vw] [&>div]:!w-[36.25vw]",
    scale: 9,
  },
];

function FullscreenHeader() {
  return (
    <div className="text-center font-montserrat font-bold text-[40px] leading-normal text-[#101828] max-md:text-[20px] max-md:leading-[normal] max-md:px-4">
      The{" "}
      <span className="relative inline-block">
        <span className="text-[#343DE5]">official</span>
        {/* Exact SVG underline from Figma — slightly rotated scribble */}
        <img
          aria-hidden
          src="/official-underline.svg"
          alt=""
          className="absolute left-0 right-0 -bottom-[4px] w-full h-[14px] rotate-[4.56deg] max-md:-bottom-[2px] max-md:h-[8px]"
        />
      </span>{" "}
      community of Kollab
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="w-full bg-white">
      <div className="text-center pt-16 pb-0 px-[54px] max-md:pt-12 max-md:px-4">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] max-md:text-[24px] max-md:leading-[32px]">
          Featured products
        </h2>
      </div>
      {/* Desktop uses PARALLAX_CARDS; mobile swaps to MOBILE_PARALLAX_CARDS
          (a Figma-matched mosaic of 7 cards where Kollabers sits at
          centre and 6 others spread around it). The ZoomParallax handles
          the swap and layoutScale internally. */}
      <ZoomParallax
        cards={PARALLAX_CARDS}
        mobileCards={MOBILE_PARALLAX_CARDS}
        centerCardWidthVw={18}
        mobileCenterCardWidthVw={46.36}
        overlay={<FullscreenHeader />}
      />
    </section>
  );
}
