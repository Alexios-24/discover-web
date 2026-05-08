"use client";

import { useState, useEffect } from "react";

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
    <div className="relative aspect-[3/4] h-[371px] w-[278px] shrink-0 overflow-hidden rounded-[16px] group cursor-pointer [transform:translateZ(0)]">
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

      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-[10px] px-3 py-6 z-10">
        <div className="text-center font-semibold text-[24px] text-white leading-[26px] h-[52px] flex flex-col justify-center overflow-hidden w-full">
          {creator.name.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </div>
        <p className="text-[13px] leading-[18px] text-white text-center w-full truncate">
          {creator.role}
        </p>
      </div>
    </div>
  );
}

export function CreatorsSection() {
  const doubled = [...CREATORS, ...CREATORS];

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-[54px] mb-8">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full">
          Top experts building on Kollab
        </h2>
      </div>

      {/* Marquee container */}
      <div className="relative w-full">
        <div className="flex gap-6 animate-marquee-creators">
          {doubled.map((creator, i) => (
            <CreatorCard key={`${creator.name.join("-")}-${i}`} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
}
