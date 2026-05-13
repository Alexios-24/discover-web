"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Globe } from "lucide-react";

interface TrendingCard {
  title: string;
  members: string;
  pricing: string;
  image: string;
  fallback: [number, number, number];
}

const CARDS: TrendingCard[] = [
  {
    title: "Tourists forever",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-1.jpg",
    fallback: [19, 65, 92],
  },
  {
    title: "PS5 officials",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-2.jpg",
    fallback: [10, 19, 24],
  },
  {
    title: "Tech enthusiasts",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-3.jpg",
    fallback: [38, 24, 14],
  },
  {
    title: "Wander together",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-4.jpg",
    fallback: [42, 51, 34],
  },
  {
    title: "F1 enthusiasts",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-5.jpg",
    fallback: [22, 30, 18],
  },
  {
    title: "Aviation collective",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-6.jpg",
    fallback: [44, 26, 8],
  },
  {
    title: "Track legends",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-7.jpg",
    fallback: [26, 28, 22],
  },
  {
    title: "Urban explorers",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-8.jpg",
    fallback: [51, 35, 26],
  },
  {
    title: "Red dead redemption",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-9.jpg",
    fallback: [26, 14, 8],
  },
  {
    title: "Wild Norway",
    members: "27.4K members",
    pricing: "Free",
    image: "/trending/trending-10.jpg",
    fallback: [14, 39, 53],
  },
];

// Sample the BOTTOM strip of the image (where the gradient sits) and darken
// for a deep shade that blends seamlessly into solid color at the card edge.
function useImageBottomColor(
  imageUrl: string,
  fallback: [number, number, number],
): [number, number, number] {
  const [rgb, setRgb] = useState<[number, number, number]>(fallback);

  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 64;
      canvas.height = 64;
      ctx.drawImage(img, 0, 0, 64, 64);
      try {
        const data = ctx.getImageData(0, 48, 64, 16).data;
        let r = 0,
          g = 0,
          b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor((r / count) * 0.55);
        g = Math.floor((g / count) * 0.55);
        b = Math.floor((b / count) * 0.55);

        if (mounted) setRgb([r, g, b]);
      } catch (e) {
        console.warn("Could not extract image color", e);
      }
    };
    img.src = imageUrl;
    return () => {
      mounted = false;
    };
  }, [imageUrl]);

  return rgb;
}

function Card({ card }: { card: TrendingCard }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [r, g, b] = useImageBottomColor(card.image, card.fallback);
  const gradient = `linear-gradient(to bottom, rgba(${r},${g},${b},0) 0%, rgba(${r},${g},${b},0.5) 47.769%, rgba(${r},${g},${b},1) 100%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: "1200px" }}
      className="relative w-[600px] h-[337.5px] shrink-0 cursor-pointer group max-lg:w-[420px] max-lg:h-[236px] max-md:w-[300px] max-md:h-[169px]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full overflow-hidden rounded-[16px]"
      >
        <img
          src={card.image}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />

        <div
          className="absolute left-0 right-0 bottom-0 flex items-center gap-[7.697px] p-4 max-md:p-3 max-md:gap-2"
          style={{ background: gradient }}
        >
          <div
            className="flex-1 min-w-0 flex flex-col gap-2 justify-center max-md:gap-1"
            style={{ transform: "translateZ(30px)" }}
          >
            <h3 className="font-inter text-[24px] leading-[32px] font-semibold text-white max-md:text-[16px] max-md:leading-[20px]">
              {card.title}
            </h3>
            <div className="flex items-center gap-2 w-full max-md:gap-1.5">
              <span className="flex items-center justify-center gap-[2px] h-6 max-h-6 min-h-6 px-2 rounded-[12px] bg-white/25 shrink-0 max-md:h-5 max-md:max-h-5 max-md:min-h-5 max-md:px-1.5 max-md:rounded-[10px]">
                <Globe size={16} className="text-white max-md:size-3" />
                <span className="font-inter text-[13px] leading-[18px] font-medium text-white whitespace-nowrap max-md:text-[11px] max-md:leading-[14px]">
                  {card.pricing}
                </span>
              </span>
              <span className="size-[6px] rounded-full bg-white/60 shrink-0 max-md:size-[4px]" />
              <span className="font-inter text-[16px] leading-6 text-[#EAECF0] truncate max-md:text-[12px] max-md:leading-4">
                {card.members}
              </span>
            </div>
          </div>
          <button
            className="shrink-0 bg-white border border-[#D0D5DD] rounded-[8px] px-[14px] py-2 font-inter text-[14px] leading-5 font-semibold text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors max-md:px-2.5 max-md:py-1.5 max-md:text-[12px] max-md:leading-4 max-md:rounded-[6px]"
            style={{ transform: "translateZ(30px)" }}
          >
            Join now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const isUserScrolling = useRef(false);
  const userScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Last scrollLeft value WE wrote programmatically. Any drift from this on
  // the next tick means the user (or browser inertia) scrolled the strip,
  // and we should pause auto-scroll. This is more reliable than listening
  // to touchstart/touchmove because vertical page swipes — which do NOT
  // change scrollLeft — would otherwise pause auto-scroll forever on
  // touch devices.
  const lastSetScrollLeft = useRef(0);

  // Duplicate the list so we can loop seamlessly: when scrollLeft passes
  // halfWidth we wrap back by halfWidth, which is invisible because the
  // second half of the list is identical to the first.
  const doubled = [...CARDS, ...CARDS];

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    const SPEED_PX_PER_SEC = 60;

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      const el = scrollRef.current;
      if (el) {
        const halfWidth = el.scrollWidth / 2;

        // Detect user-driven scroll: if the current scrollLeft differs
        // from what we last wrote, the user (or inertia) moved it.
        const drift = Math.abs(el.scrollLeft - lastSetScrollLeft.current);
        if (drift > 2) {
          isUserScrolling.current = true;
          if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
          userScrollTimeout.current = setTimeout(() => {
            isUserScrolling.current = false;
          }, 1200);
        }

        if (
          halfWidth > 0 &&
          !isHovering.current &&
          !isUserScrolling.current
        ) {
          el.scrollLeft += (SPEED_PX_PER_SEC * dt) / 1000;
        }

        // Seamless wrap (applies to both auto-scroll and user scroll)
        if (halfWidth > 0) {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          } else if (el.scrollLeft < 0) {
            el.scrollLeft += halfWidth;
          }
        }

        lastSetScrollLeft.current = el.scrollLeft;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
    };
  }, []);

  const handleMouseEnter = () => {
    isHovering.current = true;
  };
  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  return (
    <section className="w-full py-16 bg-white overflow-hidden max-md:py-10">
      <div className="max-w-[1440px] mx-auto px-[54px] mb-8 max-md:px-4 max-md:mb-5">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full max-md:text-[24px] max-md:leading-[32px]">
          Trending now
        </h2>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full overflow-x-auto overflow-y-hidden no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-6 w-max max-md:gap-3 max-md:px-4">
          {doubled.map((card, i) => (
            <Card key={`${card.title}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
