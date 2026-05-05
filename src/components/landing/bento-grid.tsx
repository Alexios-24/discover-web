"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface BentoTile {
  title: string;
  creator: string;
  members: string;
  type: "Community" | "Course";
  pricing: string;
  image: string;
  size: "lg" | "md" | "sm";
}

const TILES: BentoTile[] = [
  {
    title: "F1 enthusiasts",
    creator: "Phoenix Baker",
    members: "27.4K",
    type: "Community",
    pricing: "$99/mo",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=70",
    size: "lg",
  },
  {
    title: "Procreate masters",
    creator: "Lois Lane",
    members: "27.4K",
    type: "Community",
    pricing: "Free",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=70",
    size: "md",
  },
  {
    title: "How to read books effectively",
    creator: "Alec Whitten",
    members: "27.4K",
    type: "Course",
    pricing: "$99/mo",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=70",
    size: "md",
  },
  {
    title: "Tourists forever",
    creator: "Marco Rivera",
    members: "18.2K",
    type: "Community",
    pricing: "Free",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=70",
    size: "sm",
  },
  {
    title: "VR enthusiasts",
    creator: "Alec Whitten",
    members: "27.4K",
    type: "Course",
    pricing: "$99/mo",
    image: "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&auto=format&fit=crop&q=70",
    size: "sm",
  },
  {
    title: "Retro gaming collective",
    creator: "Jake Morris",
    members: "32.1K",
    type: "Community",
    pricing: "Free",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=70",
    size: "lg",
  },
];

export function BentoGrid() {
  return (
    <section className="relative py-32 px-10 bg-cream text-ink overflow-hidden">
      <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-8">
        <span className="w-6 h-px bg-lime" />
        <span>Browse the wall</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2
          className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.9] text-ink max-w-[1100px]"
          style={{ fontSize: "clamp(56px, 7vw, 120px)" }}
        >
          Tap. Tilt. <span className="italic font-medium text-magenta">Open.</span>
        </h2>
        <p className="text-[18px] text-gray-600 max-w-[420px]">
          Hover anything. Every card is alive — because every product on GoKollab is run by a real human who's online right now.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5 auto-rows-[180px]">
        {/* Row 1 */}
        <TiltCard className="col-span-12 md:col-span-7 row-span-2" tile={TILES[0]} />
        <TiltCard className="col-span-12 md:col-span-5 row-span-2" tile={TILES[1]} />
        {/* Row 3 */}
        <TiltCard className="col-span-6 md:col-span-4 row-span-2" tile={TILES[2]} />
        <TiltCard className="col-span-6 md:col-span-4 row-span-2" tile={TILES[3]} />
        <TiltCard className="col-span-12 md:col-span-4 row-span-2" tile={TILES[4]} />
        {/* Row 5 - full bleed */}
        <TiltCard className="col-span-12 row-span-2" tile={TILES[5]} />
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          href="/discover"
          className="group inline-flex items-center gap-3 bg-ink text-cream px-8 py-[18px] rounded-full font-bold text-[15px] hover:bg-magenta transition-colors"
        >
          Explore all 158,203+ products
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}

function TiltCard({ tile, className = "" }: { tile: BentoTile; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);

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
    setHovered(false);
  };

  return (
    <Link
      href="/discover"
      className={className}
      ref={ref as never}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full overflow-hidden rounded-[24px] border border-ink/8 group"
      >
        <img
          src={tile.image}
          alt={tile.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />

        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full font-sans text-[11px] bg-cream/95 text-ink backdrop-blur-sm">
          {tile.pricing}
        </span>

        <span
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full font-sans text-[10px] uppercase tracking-[0.18em] ${
            tile.type === "Community" ? "bg-lime text-ink" : "bg-magenta text-cream"
          }`}
        >
          {tile.type}
        </span>

        <div
          className="absolute bottom-0 left-0 right-0 p-6 text-cream"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3
            className="font-montserrat font-extrabold tracking-[-0.02em] leading-[1] mb-1"
            style={{ fontSize: tile.size === "lg" ? "32px" : "22px" }}
          >
            {tile.title}
          </h3>
          <div className="flex items-center justify-between text-[12px] font-sans text-cream/80">
            <span>by {tile.creator}</span>
            <span>{tile.members} members</span>
          </div>
        </div>

        {/* Cursor follower */}
        {hovered && <CursorFollower mouseX={mouseX} mouseY={mouseY} />}
      </motion.div>
    </Link>
  );
}

function CursorFollower({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(mouseX, [-1, 1], ["10%", "90%"]);
  const y = useTransform(mouseY, [-1, 1], ["10%", "90%"]);
  return (
    <motion.div
      style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      className="absolute pointer-events-none z-10"
    >
      <div className="bg-cream text-ink font-bold text-[12px] px-3 py-1.5 rounded-full whitespace-nowrap shadow-md">
        Open →
      </div>
    </motion.div>
  );
}
