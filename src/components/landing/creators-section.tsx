"use client";

import { useState, useRef, useEffect } from "react";

interface Creator {
  name: [string] | [string, string];
  role: string;
  image: string;
  hasGradient: boolean;
  gradientColor?: string;
}

const CREATORS: Creator[] = [
  {
    name: ["Sam", "Ovens"],
    role: "Entrepreneur & Coach",
    image: "/creators/creator-1.png",
    hasGradient: true,
  },
  {
    name: ["Lisa", "Nichols"],
    role: "Motivational Speaker",
    image: "/creators/creator-2.png",
    hasGradient: true,
  },
  {
    name: ["Max", "Lugavere"],
    role: "Health & Wellness",
    image: "/creators/creator-3.png",
    hasGradient: true,
  },
  {
    name: ["Arthur &", "Ruben"],
    role: "Real Estate Investors",
    image: "/creators/creator-4.png",
    hasGradient: true,
  },
  {
    name: ["Lando", "Norris"],
    role: "F1 Driver",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=480&h=640&auto=format&fit=crop&q=80",
    hasGradient: false,
    gradientColor: "135, 42, 10",
  },
  {
    name: ["Maria", "Sharapova"],
    role: "Tennis Player",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&h=640&auto=format&fit=crop&q=80",
    hasGradient: false,
    gradientColor: "20, 18, 17",
  },
  {
    name: ["Dwayne", "Johnson"],
    role: "Wrestler and Actor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=640&auto=format&fit=crop&q=80",
    hasGradient: false,
    gradientColor: "2, 45, 35",
  },
  {
    name: ["CarryMinati"],
    role: "YouTuber",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=640&auto=format&fit=crop&q=80",
    hasGradient: false,
    gradientColor: "44, 32, 34",
  },
];

function useImageColor(imageUrl: string, fallbackColor: string | undefined): string {
  const [color, setColor] = useState<string>(fallbackColor || "0, 0, 0");

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

        r = Math.floor(r * 0.8);
        g = Math.floor(g * 0.8);
        b = Math.floor(b * 0.8);

        if (mounted) {
          setColor(`${r}, ${g}, ${b}`);
        }
      } catch (e) {
        console.warn("Could not extract image color due to CORS", e);
      }
    };
    img.src = imageUrl;
    return () => {
      mounted = false;
    };
  }, [imageUrl, fallbackColor]);

  return color;
}

function CreatorCard({ creator }: { creator: Creator }) {
  const extractedColor = useImageColor(creator.image, creator.gradientColor);

  return (
    <div className="relative aspect-[3/4] h-[371px] w-[278px] shrink-0 overflow-hidden rounded-[16px] group cursor-pointer [transform:translateZ(0)] max-lg:h-[280px] max-lg:w-[210px] max-md:h-[200px] max-md:w-[150px] max-md:rounded-[12px]">
      <img
        src={creator.image}
        alt={creator.name.join(" ")}
        className="absolute inset-0 w-full h-full object-cover rounded-[16px] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        loading="lazy"
      />

      {!creator.hasGradient && (
        <div
          className="absolute inset-0 rounded-[16px]"
          style={{
            backgroundImage: `linear-gradient(160.5deg, rgba(${extractedColor}, 0) 63.26%, rgba(${extractedColor}, 1) 79.95%)`,
          }}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-[10px] px-3 py-6 z-10 max-md:gap-1 max-md:px-2 max-md:py-4">
        <div className="text-center font-semibold text-[24px] text-white leading-[26px] h-[52px] flex flex-col justify-center overflow-hidden w-full max-md:text-[15px] max-md:leading-[18px] max-md:h-[36px]">
          {creator.name.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </div>
        <p className="text-[13px] leading-[18px] text-white text-center w-full truncate max-md:text-[11px] max-md:leading-[14px]">
          {creator.role}
        </p>
      </div>
    </div>
  );
}

export function CreatorsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const doubled = [...CREATORS, ...CREATORS];

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

        if (halfWidth > 0 && !isHovering.current) {
          el.scrollLeft += (SPEED_PX_PER_SEC * dt) / 1000;
        }

        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="w-full py-16 bg-white overflow-hidden max-md:py-10">
      <div className="max-w-[1440px] mx-auto px-[54px] mb-8 max-md:px-4 max-md:mb-5">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full max-md:text-[24px] max-md:leading-[32px]">
          Top experts building on Kollab
        </h2>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => {
          isHovering.current = true;
        }}
        onMouseLeave={() => {
          isHovering.current = false;
        }}
        className="w-full overflow-x-auto overflow-y-hidden no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-6 w-max max-md:gap-3">
          {doubled.map((creator, i) => (
            <CreatorCard key={`${creator.name.join("-")}-${i}`} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
}
