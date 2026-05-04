"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export interface AnimatedPromoCardProps {
  imageSrc: string;
  title: string;
  members: string;
  isFree?: boolean;
  buttonText?: string;
  href?: string;
  className?: string;
}

export const AnimatedPromoCard = ({
  imageSrc,
  title,
  members,
  isFree = true,
  buttonText = "Join now",
  href = "#",
  className,
}: AnimatedPromoCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 50, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 50, mass: 0.5 });

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={cn(
        "relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-background shadow-lg cursor-pointer",
        className,
      )}
    >
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div
        style={{ transform: "translateZ(50px)" }}
        className="relative z-10 h-full flex flex-col justify-end p-5"
      >
        <h3 className="text-[24px] leading-[32px] font-semibold text-white">{title}</h3>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/25 backdrop-blur-sm">
            <span className="flex items-center gap-1 text-white text-[13px] font-medium">
              <Globe size={14} />
              {isFree ? "Free" : "Paid"}
            </span>
            <span className="text-white/75">•</span>
            <span className="text-white text-[13px] font-medium">{members} members</span>
          </div>
          <a href={href}>
            <button className="bg-white text-gray-900 hover:bg-white/90 text-[13px] font-semibold rounded-md h-8 px-3 shadow-xs transition-colors">
              {buttonText}
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};
