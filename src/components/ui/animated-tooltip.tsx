"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CursorTooltipProps {
  children: ReactNode;
  label: string;
  enabled?: boolean;
}

export function CursorTooltip({ children, label, enabled = true }: CursorTooltipProps) {
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = useMotionValue(-9999);
  const cy = useMotionValue(-9999);
  const offsetX = useMotionValue(0);

  const left = useSpring(cx, { stiffness: 350, damping: 30, mass: 0.5 });
  const top = useSpring(cy, { stiffness: 350, damping: 30, mass: 0.5 });

  const rotate = useSpring(useTransform(offsetX, [-200, 200], [-15, 15]), {
    stiffness: 100,
    damping: 15,
  });

  const updateFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    cx.set(e.clientX);
    cy.set(e.clientY);
    const rect = e.currentTarget.getBoundingClientRect();
    offsetX.set(e.clientX - rect.left - rect.width / 2);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    updateFromEvent(e);
    cx.jump(e.clientX);
    cy.jump(e.clientY);
    setHovering(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    if (!hovering) setHovering(true);
    updateFromEvent(e);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const tooltipNode = (
    <motion.div
      key="cursor-tooltip"
      style={{
        position: "fixed",
        left,
        top,
        translateX: "-50%",
        translateY: "-160%",
        rotate,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex items-center justify-center rounded-full bg-white px-5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <span className="whitespace-nowrap text-[15px] font-semibold text-[#101828] font-inter">
        {label}
      </span>
    </motion.div>
  );

  return (
    <div
      className={`relative w-full h-full ${enabled ? "cursor-none" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {hovering && enabled && mounted &&
        createPortal(tooltipNode, document.body)}
      {children}
    </div>
  );
}
