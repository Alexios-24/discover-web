"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

type HoverWord = "communities" | "courses" | "creators" | null;

interface FloatingCard {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  image: string;
  delay: number;
}

const COMMUNITY_THUMBS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&h=120&auto=format&fit=crop&q=60",
];

const COURSE_THUMBS = [
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=200&h=120&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=120&auto=format&fit=crop&q=60",
];

const CREATOR_THUMBS = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&fit=crop&q=60",
];

// Card container is 854px wide centered in 1440px hero → offset = (1440 - 854) / 2 = 293px
const O = 293;
// Center origin point for the shuffle animation (center of hero)
const CENTER_X = 690;
const CENTER_Y = 60;

const FLOATING_CARDS: Record<string, FloatingCard[]> = {
  communities: [
    { id: "c1", left: O + 157, top: 22, width: 72, height: 40, rotate: -16.46, image: COMMUNITY_THUMBS[0], delay: 0 },
    { id: "c2", left: O + 90, top: 115, width: 64, height: 36, rotate: 0.58, image: COMMUNITY_THUMBS[1], delay: 0.03 },
    { id: "c3", left: O + 632, top: 36, width: 64, height: 36, rotate: -0.37, image: COMMUNITY_THUMBS[2], delay: 0.05 },
    { id: "c4", left: O + 713, top: 104, width: 76, height: 43, rotate: 16.41, image: COMMUNITY_THUMBS[3], delay: 0.07 },
  ],
  courses: [
    { id: "s1", left: O + 147, top: 13, width: 72, height: 40, rotate: 15, image: COURSE_THUMBS[0], delay: 0 },
    { id: "s2", left: O + 85, top: 102, width: 64, height: 36, rotate: -30, image: COURSE_THUMBS[1], delay: 0.03 },
    { id: "s3", left: O + 629, top: 29, width: 64, height: 36, rotate: -15, image: COURSE_THUMBS[2], delay: 0.05 },
    { id: "s4", left: O + 717, top: 114, width: 76, height: 43, rotate: 0, image: COURSE_THUMBS[3], delay: 0.07 },
  ],
  creators: [
    { id: "r1", left: O + 142, top: -2, width: 60, height: 60, rotate: 15, image: CREATOR_THUMBS[0], delay: 0 },
    { id: "r2", left: O + 72, top: 114, width: 54, height: 54, rotate: 0, image: CREATOR_THUMBS[1], delay: 0.03 },
    { id: "r3", left: O + 642, top: 14, width: 48, height: 48, rotate: -16.18, image: CREATOR_THUMBS[2], delay: 0.05 },
    { id: "r4", left: O + 705, top: 114, width: 54, height: 54, rotate: 25.29, image: CREATOR_THUMBS[3], delay: 0.07 },
  ],
};

function ShuffleCard({ card }: { card: FloatingCard }) {
  return (
    <motion.div
      className="absolute rounded-md overflow-hidden shadow-md"
      style={{ width: card.width, height: card.height }}
      initial={{
        left: CENTER_X - card.width / 2,
        top: CENTER_Y - card.height / 2,
        rotate: 0,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        left: card.left,
        top: card.top,
        rotate: card.rotate,
        opacity: 1,
        scale: 1,
      }}
      exit={{
        left: CENTER_X - card.width / 2,
        top: CENTER_Y - card.height / 2,
        rotate: 0,
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 0.45,
        delay: card.delay,
        ease: [0.22, 0.68, 0.35, 1] as const,
      }}
    >
      <img
        src={card.image}
        alt=""
        className="w-full h-full object-cover"
        loading="eager"
      />
    </motion.div>
  );
}

export function DiscoverHero() {
  const [hoveredWord, setHoveredWord] = useState<HoverWord>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") ?? "";

  // Search-results variant — replaces the welcome hero when ?q= is present
  if (query) {
    return (
      <section className="w-full px-[54px] pt-8 pb-2 flex items-center justify-between gap-6 max-md:px-4 max-md:pt-5 max-md:flex-col max-md:items-start max-md:gap-3">
        <h1 className="font-inter text-[24px] leading-[32px] text-gray-900 max-md:text-[18px] max-md:leading-[24px]">
          Search results for{" "}
          <span className="font-semibold">&ldquo;{query}&rdquo;</span>
        </h1>
        <button
          type="button"
          onClick={() => router.push("/discover")}
          className="shrink-0 border border-gray-300 rounded-lg px-[14px] py-2 text-[14px] leading-5 font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
        >
          Clear search
        </button>
      </section>
    );
  }

  return (
    <section className="w-full h-[187px] px-[54px] relative flex items-center justify-center max-md:h-auto max-md:px-4 max-md:py-8">
      {/* Floating card thumbnails — shuffle from center (decorative, hidden on mobile) */}
      <AnimatePresence>
        {hoveredWord && (
          <div
            key={hoveredWord}
            className="absolute inset-0 pointer-events-none z-0 overflow-visible max-md:hidden"
          >
            <div className="relative w-full h-full max-w-[1440px] mx-auto">
              {FLOATING_CARDS[hoveredWord].map((card) => (
                <ShuffleCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4 relative z-10 max-md:gap-3 w-full">
        <div className="flex flex-col gap-1 items-center text-center w-full">
          <h1 className="font-montserrat font-semibold text-[40px] leading-[1.2] text-gray-900 max-md:text-[28px]">
            Discover
          </h1>
          <p className="text-[16px] leading-6 text-gray-900 max-w-[1200px] max-md:text-[14px] max-md:leading-5">
            Find{" "}
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                hoveredWord === "communities"
                  ? "text-[#8385F2] font-semibold"
                  : ""
              }`}
              onMouseEnter={() => setHoveredWord("communities")}
              onMouseLeave={() => setHoveredWord(null)}
            >
              communities
            </span>
            ,{" "}
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                hoveredWord === "courses"
                  ? "text-[#8385F2] font-semibold"
                  : ""
              }`}
              onMouseEnter={() => setHoveredWord("courses")}
              onMouseLeave={() => setHoveredWord(null)}
            >
              courses
            </span>
            , and{" "}
            <span
              className={`cursor-pointer transition-colors duration-200 ${
                hoveredWord === "creators"
                  ? "text-[#8385F2] font-semibold"
                  : ""
              }`}
              onMouseEnter={() => setHoveredWord("creators")}
              onMouseLeave={() => setHoveredWord(null)}
            >
              creators
            </span>{" "}
            that transform your life.
          </p>
        </div>

        {/* Animated search input with rotating gradient border */}
        <div id="hero-search" className="w-[500px] max-w-full">
          <div className="relative rounded-md p-px overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.12)]">
            <div
              className="absolute left-1/2 top-1/2 w-[520px] h-[520px] animate-border-spin"
              style={{
                background:
                  "conic-gradient(from 90deg, #8385F2 0%, #B7B9F1 4.81%, #EAECF0 9.62%, #B7B9F1 54.81%, #8385F2 100%)",
              }}
            />
            <button className="relative w-full flex items-center gap-1 h-11 bg-white rounded-[7px] px-[14px] cursor-pointer">
              <Search size={20} className="text-gray-500 shrink-0" />
              <span className="text-[16px] leading-6 text-gray-500 truncate">
                Search for communities, courses, creators
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
