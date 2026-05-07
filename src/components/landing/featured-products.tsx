"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { type MotionValue } from "framer-motion";
import { ZoomParallax, type ParallaxCard } from "@/components/ui/zoom-parallax";

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
}: {
  card: ProductCard;
  parentScale: MotionValue<number>;
}) {
  const isGlobe = card.pricing === "Free";

  // Subscribe to parent scale so we can apply an inverse transform on the
  // text overlay — the image scales with the card, but the title / tag /
  // members count stay at a constant pixel size.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    setScale(parentScale.get());
    const unsub = parentScale.on("change", setScale);
    return unsub;
  }, [parentScale]);

  const inverseScale = 1 / Math.max(scale, 0.001);
  const dynamicRadius = 16 * inverseScale;

  return (
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
          transform: `scale(${inverseScale})`,
          transformOrigin: "left bottom",
          width: `${scale * 100}%`,
        }}
        className="absolute bottom-0 left-0"
      >
        <div
          className="flex items-end p-4"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${card.gradientTo}80 47.77%, ${card.gradientTo} 100%)`,
          }}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h3 className="text-[18px] leading-[28px] font-semibold text-white font-inter truncate">
              {card.title}
            </h3>
            <div className="flex items-center gap-[6px] whitespace-nowrap">
              <span className="flex items-center gap-[2px] h-6 px-2 rounded-[12px] bg-white/25 shrink-0">
                {isGlobe && <Globe size={16} className="text-white" />}
                <span className="text-[13px] leading-[18px] font-medium text-white font-inter">
                  {card.pricing}
                </span>
              </span>
              <span className="size-[6px] rounded-full bg-white/60 shrink-0" />
              <span className="text-[14px] leading-[18px] text-[#EAECF0] font-inter shrink-0">
                {card.members}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
    content: (s) => <CardContent card={CARDS[0]} parentScale={s} />,
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

function FullscreenHeader() {
  return (
    <div className="text-center font-montserrat font-bold text-[40px] leading-normal text-[#101828]">
      The{" "}
      <span className="relative inline-block">
        <span className="text-[#343DE5]">official</span>
        {/* Exact SVG underline from Figma — slightly rotated scribble */}
        <img
          aria-hidden
          src="/official-underline.svg"
          alt=""
          className="absolute left-0 right-0 -bottom-[4px] w-full h-[14px] rotate-[4.56deg]"
        />
      </span>{" "}
      community of Kollab
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="w-full bg-white">
      <div className="text-center pt-16 pb-0 px-[54px]">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828]">
          Featured products
        </h2>
      </div>
      <ZoomParallax
        cards={PARALLAX_CARDS}
        overlay={<FullscreenHeader />}
      />
    </section>
  );
}
