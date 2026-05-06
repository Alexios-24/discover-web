"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Globe } from "lucide-react";

interface TrendingCard {
  title: string;
  members: string;
  pricing: string;
  image: string;
  gradientTo: string;
}

const CARDS: TrendingCard[] = [
  {
    title: "Tourists forever",
    members: "27.4K members",
    pricing: "Free",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=675&auto=format&fit=crop&q=80",
    gradientTo: "#013985",
  },
  {
    title: "PS5 officials",
    members: "27.4K members",
    pricing: "Free",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=675&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
];

function useImageColor(imageUrl: string, fallbackHex: string): [number, number, number] {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? ([
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ] as [number, number, number])
      : ([0, 0, 0] as [number, number, number]);
  };

  const [rgb, setRgb] = useState<[number, number, number]>(hexToRgb(fallbackHex));

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
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let r = 0, g = 0, b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Darken the color slightly for better text contrast
        r = Math.floor(r * 0.5);
        g = Math.floor(g * 0.5);
        b = Math.floor(b * 0.5);

        if (mounted) {
          setRgb([r, g, b]);
        }
      } catch (e) {
        console.warn("Could not extract image color due to CORS", e);
      }
    };
    img.src = imageUrl;
    return () => {
      mounted = false;
    };
  }, [imageUrl, fallbackHex]);

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

  const [r, g, b] = useImageColor(card.image, card.gradientTo);
  const gradient = `linear-gradient(to bottom, transparent 0%, rgba(${r},${g},${b},0.5) 47.77%, rgba(${r},${g},${b},1) 100%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: "1200px" }}
      className="relative w-full aspect-[16/9] cursor-pointer group"
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

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 flex items-end p-4"
          style={{ background: gradient }}
        >
          <div
            className="flex items-center gap-2 w-full"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Text content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <h3 className="text-[24px] leading-[32px] font-semibold text-white">
                {card.title}
              </h3>
              <div className="flex items-center gap-2">
                {/* Free tag */}
                <span className="flex items-center gap-[2px] h-6 px-2 rounded-[12px] bg-white/25">
                  <Globe size={16} className="text-white" />
                  <span className="text-[13px] leading-[18px] font-medium text-white">
                    {card.pricing}
                  </span>
                </span>
                {/* Dot */}
                <span className="size-[6px] rounded-full bg-white/60" />
                {/* Members */}
                <span className="text-[16px] leading-6 text-[#EAECF0]">
                  {card.members}
                </span>
              </div>
            </div>

            {/* Join now button */}
            <button className="shrink-0 bg-white border border-[#D0D5DD] rounded-[8px] px-[14px] py-2 text-[14px] leading-5 font-semibold text-[#344054] shadow-xs hover:bg-gray-50 transition-colors">
              Join now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function TrendingSection() {
  return (
    <section className="w-full px-[54px] py-16 bg-white">
      <div className="max-w-[1332px] mx-auto flex flex-col items-start gap-8">
        {/* Heading */}
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full">
          Trending now
        </h2>

        {/* Cards row */}
        <div className="flex flex-wrap gap-6 w-full">
          {CARDS.map((card) => (
            <div key={card.title} className="flex-1 min-w-[300px]">
              <Card card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
