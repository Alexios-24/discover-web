"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { CursorTooltip } from "@/components/ui/animated-tooltip";

interface Product {
  title: string;
  members: string;
  category: string;
  image: string;
}

interface CategorySet {
  label: string;
  bg: string;
  left: Product;
  center: Product;
  right: Product;
}

const SETS: CategorySet[] = [
  {
    label: "Wellness",
    bg: "#2c4860",
    left: {
      title: "Yoga forever",
      members: "20K members",
      category: "Wellness",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&auto=format&fit=crop&q=80",
    },
    center: {
      title: "Health & yoga",
      members: "14.5K members",
      category: "Wellness",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&auto=format&fit=crop&q=80",
    },
    right: {
      title: "Understanding human psychology",
      members: "1K members",
      category: "Wellness",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=600&auto=format&fit=crop&q=80",
    },
  },
  {
    label: "Productivity",
    bg: "#0C2145",
    left: {
      title: "Photography for beginners",
      members: "11K members",
      category: "Productivity",
      image:
        "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=600&h=600&auto=format&fit=crop&q=80",
    },
    center: {
      title: "Podcasting fundamentals",
      members: "14.5K members",
      category: "Productivity",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&auto=format&fit=crop&q=80",
    },
    right: {
      title: "Frontend masters",
      members: "20K members",
      category: "Productivity",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&auto=format&fit=crop&q=80",
    },
  },
  {
    label: "Creative",
    bg: "#0b4a6f",
    left: {
      title: "Understanding gaming industry",
      members: "9.5K members",
      category: "Creative",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&auto=format&fit=crop&q=80",
    },
    center: {
      title: "PS5 officials",
      members: "10.5K members",
      category: "Creative",
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&auto=format&fit=crop&q=80",
    },
    right: {
      title: "90s games",
      members: "20K members",
      category: "Creative",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&auto=format&fit=crop&q=80",
    },
  },
];

const LOOP = [...SETS, SETS[0]];
const N = SETS.length;
const CYCLE_MS = 4000;

const CARD_LEFT = 393;
const GAP_LEFT = 86;
const CARD_CENTER = 300;
const GAP_CENTER = 165;
const CARD_RIGHT = 360;
const GAP_RIGHT = 130;
const LABEL_H = 28;
const LABEL_GAP = 16;

// Mobile single-column dimensions — used in the cosmos.so-style mobile frame.
const M_CARD = 220;
const M_GAP = 120;
const M_FRAME_H = 340;
const M_LABEL_H = 24;
const M_LABEL_GAP = 14;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function ProductCard({
  product,
  size,
}: {
  product: Product;
  size: "lg" | "md" | "sm";
}) {
  const ts =
    size === "lg"
      ? {
          title: "text-[18px] leading-[28px]",
          meta: "text-[14px] leading-5",
          dot: "size-[4px]",
          cat: "text-[13px]",
          pad: "px-4 py-4",
        }
      : size === "md"
        ? {
            title: "text-[16px] leading-[26px]",
            meta: "text-[13px] leading-[18px]",
            dot: "size-[3.5px]",
            cat: "text-[12px]",
            pad: "p-[15px]",
          }
        : {
            title: "text-[14px] leading-[21px]",
            meta: "text-[11px] leading-[15px]",
            dot: "size-[3px]",
            cat: "text-[10px]",
            pad: "p-3",
          };

  return (
    <div
      className="w-full aspect-square relative overflow-hidden shrink-0 rounded-[16px] [transform:translateZ(0)]"
    >
      <img
        src={product.image}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover rounded-[16px]"
        loading="lazy"
      />
      <div
        className={`absolute bottom-0 left-0 right-0 backdrop-blur-[12px] bg-black/50 rounded-b-[16px] ${ts.pad}`}
      >
        <p className={`font-semibold text-white ${ts.title}`}>
          {product.title}
        </p>
        <div className="flex items-center gap-1">
          <span className={`text-[#EAECF0] ${ts.meta}`}>
            {product.members}
          </span>
          <span className={`rounded-full bg-[#EAECF0] ${ts.dot}`} />
          <span className={`text-[#EAECF0] ${ts.cat}`}>
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CategoryShowcase() {
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [bgColor, setBgColor] = useState(SETS[0].bg);
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollIndexRef = useRef(0);
  const cooldownRef = useRef(false);
  const finishedRef = useRef(false);

  const advance = useCallback(() => {
    setAnimate(true);
    setPos((p) => p + 1);
  }, []);

  useEffect(() => {
    if (finishedRef.current) return;

    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (finishedRef.current) return;
      // On mobile/tablet the animated frame is hidden; never hijack scroll there.
      if (window.innerWidth < 768) return;

      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
      if (!inView) return;

      if (e.deltaY < 15) return;

      if (cooldownRef.current) {
        e.preventDefault();
        return;
      }

      const nextIdx = scrollIndexRef.current + 1;

      if (nextIdx >= N) {
        finishedRef.current = true;
        return;
      }

      e.preventDefault();
      cooldownRef.current = true;
      scrollIndexRef.current = nextIdx;

      setAnimate(true);
      setPos(nextIdx);

      setTimeout(() => {
        cooldownRef.current = false;
      }, 850);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (finishedRef.current) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance]);

  useEffect(() => {
    if (pos === N) {
      const t = setTimeout(() => {
        setAnimate(false);
        setPos(0);
        scrollIndexRef.current = 0;
      }, 800);
      return () => clearTimeout(t);
    }
  }, [pos]);

  const dataIdx = pos % N;
  useEffect(() => {
    setBgColor(SETS[dataIdx].bg);
  }, [dataIdx]);

  const tx = animate ? `0.7s ${EASE}` : "none";
  const bgStyle = {
    backgroundColor: bgColor,
    transition: animate ? `background-color 0.7s ${EASE}` : "none",
  };

  const leftY = pos * (CARD_LEFT + GAP_LEFT);
  const centerY = pos * (CARD_CENTER + GAP_CENTER);
  const rightY = pos * (CARD_RIGHT + GAP_RIGHT);
  const labelY = pos * (LABEL_H + LABEL_GAP);

  const loopLabels = [...SETS.map((s) => s.label), SETS[0].label];

  return (
    <section
      ref={sectionRef}
      className="w-full px-[54px] py-20 bg-white max-md:px-4 max-md:py-14"
    >
      <div className="max-w-[1332px] mx-auto flex flex-col items-center gap-8 max-md:gap-6">
        {/* Heading */}
        <div className="flex flex-col gap-2 items-center text-center w-full">
          <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] max-md:text-[28px] max-md:leading-[36px]">
            One platform, infinite ways to grow.
          </h2>
          <p className="text-[20px] leading-[30px] text-[#475467] max-md:text-[15px] max-md:leading-[22px]">
            Your platform. Your category. Your growth.
          </p>
        </div>

        {/* Animated frame — desktop / tablet version */}
        <CursorTooltip label="See all products">
          <Link
            href="/discover"
            aria-label="See all products"
            className="block w-full max-md:hidden"
          >
            <div
              className="relative w-full h-[459px] overflow-hidden rounded-[16px]"
              style={bgStyle}
            >
          {/* Left column — 393px */}
          <div className="absolute left-[32px] top-[33px] w-[393px] h-[393px] overflow-hidden rounded-[16px]">
            <div
              className="flex flex-col"
              style={{
                gap: `${GAP_LEFT}px`,
                transform: `translateY(-${leftY}px)`,
                transition: animate ? `transform ${tx} 80ms` : "none",
              }}
            >
              {LOOP.map((s, i) => (
                <ProductCard key={`l-${i}`} product={s.left} size="lg" />
              ))}
            </div>
          </div>

          {/* Center column — 300px */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[84px] w-[300px] h-[300px] overflow-hidden rounded-[16px]">
            <div
              className="flex flex-col"
              style={{
                gap: `${GAP_CENTER}px`,
                transform: `translateY(-${centerY}px)`,
                transition: animate ? `transform ${tx} 160ms` : "none",
              }}
            >
              {LOOP.map((s, i) => (
                <ProductCard key={`c-${i}`} product={s.center} size="sm" />
              ))}
            </div>
          </div>

          {/* Right column — 360px */}
          <div className="absolute right-[33px] top-[47px] w-[360px] h-[360px] overflow-hidden rounded-[16px]">
            <div
              className="flex flex-col"
              style={{
                gap: `${GAP_RIGHT}px`,
                transform: `translateY(-${rightY}px)`,
                transition: animate ? `transform ${tx} 240ms` : "none",
              }}
            >
              {LOOP.map((s, i) => (
                <ProductCard key={`r-${i}`} product={s.right} size="md" />
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[400px] flex items-center gap-2 backdrop-blur-[20px] bg-black/50 border border-white/20 rounded-[12px] px-[13px] py-[9px] overflow-hidden z-10"
            style={{ top: "calc(50% - 136px)" }}
          >
            <Search size={20} className="text-gray-400 shrink-0" />
            <div className="h-[28px] overflow-hidden relative flex-1">
              <div
                className="flex flex-col"
                style={{
                  gap: `${LABEL_GAP}px`,
                  transform: `translateY(-${labelY}px)`,
                  transition: animate ? `transform 0.6s ${EASE} 0ms` : "none",
                }}
              >
                {loopLabels.map((label, i) => (
                  <span
                    key={i}
                    className="text-[18px] leading-[28px] font-semibold text-white shrink-0 whitespace-nowrap"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
            </div>
          </Link>
        </CursorTooltip>

        {/* Animated frame — mobile single-column (cosmos.so style) */}
        <Link
          href="/discover"
          aria-label="See all products"
          className="hidden max-md:block w-full"
        >
          <div
            className="relative w-full overflow-hidden rounded-[16px]"
            style={{ ...bgStyle, height: M_FRAME_H }}
          >
            {/* Single center column with vertical scroll */}
            <div
              className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-[16px]"
              style={{
                width: M_CARD,
                height: M_CARD,
                top: (M_FRAME_H - M_CARD) / 2,
              }}
            >
              <div
                className="flex flex-col"
                style={{
                  gap: `${M_GAP}px`,
                  transform: `translateY(-${pos * (M_CARD + M_GAP)}px)`,
                  transition: animate ? `transform ${tx}` : "none",
                }}
              >
                {LOOP.map((s, i) => (
                  <ProductCard key={`m-c-${i}`} product={s.center} size="sm" />
                ))}
              </div>
            </div>

            {/* Search bar overlay */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 backdrop-blur-[20px] bg-black/50 border border-white/20 rounded-[12px] px-3 py-2 z-10"
              style={{
                width: "calc(100% - 32px)",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Search size={18} className="text-gray-400 shrink-0" />
              <div
                className="overflow-hidden relative flex-1"
                style={{ height: M_LABEL_H }}
              >
                <div
                  className="flex flex-col"
                  style={{
                    gap: `${M_LABEL_GAP}px`,
                    transform: `translateY(-${pos * (M_LABEL_H + M_LABEL_GAP)}px)`,
                    transition: animate ? `transform 0.6s ${EASE} 0ms` : "none",
                  }}
                >
                  {loopLabels.map((label, i) => (
                    <span
                      key={i}
                      className="text-[15px] leading-[24px] font-semibold text-white shrink-0 whitespace-nowrap"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
