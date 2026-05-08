"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface Stat {
  label: string;
  value: string;
}

const STATS: Stat[] = [
  { label: "Active creators", value: "158,203" },
  { label: "Avg session", value: "23min" },
  { label: "Products created", value: "95,590" },
  { label: "Platform fee", value: "0%" },
];

const CYCLE_MS = 2800;

const HIGHLIGHT_LEFT_PX = [29, 352, 675, 998];

export function NumbersSection() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % STATS.length);
  }, []);

  useEffect(() => {
    if (hovering) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(advance, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance, hovering]);

  const handleMouseEnter = (i: number) => {
    setHovering(true);
    setActive(i);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="flex flex-col gap-8 items-center w-full">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full">
          Numbers that compound
        </h2>

        {/* Stats bar — borders + content aligned to max-w-[1440px] px-[54px] */}
        <div className="w-full">
          <div className="relative max-w-[1440px] mx-auto px-[54px]">
            {/* Top border */}
            <div className="absolute top-0 left-[54px] right-[54px] h-px bg-[#EAECF0]" />
            {/* Bottom border */}
            <div className="absolute bottom-0 left-[54px] right-[54px] h-px bg-[#EAECF0]" />

            <div className="relative flex items-center gap-[72px] px-[56px] py-[32px] overflow-hidden">
              {/* Sliding gradient highlight — exact 304×154 from Figma, vertically centered */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-[304px] h-[154px] pointer-events-none z-10"
                animate={{ left: HIGHLIGHT_LEFT_PX[active] }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              >
                <img
                  src="/numbers-highlight.svg"
                  alt=""
                  className="absolute inset-0 w-[304px] h-[154px]"
                  draggable={false}
                />
              </motion.div>

              {/* Stats */}
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex-1 flex flex-col gap-[6px] items-center min-w-0 overflow-hidden cursor-pointer relative z-20"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.span
                    className="font-inter text-[16px] leading-[24px] font-normal whitespace-nowrap"
                    animate={{ color: i === active ? "#101828" : "#475467" }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                  >
                    {stat.label}
                  </motion.span>
                  <motion.span
                    className="font-inter font-bold text-[48px] leading-[60px] tracking-[-0.96px] text-center whitespace-nowrap"
                    animate={{ color: i === active ? "#343DE5" : "#A2A4F6" }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                  >
                    {stat.value}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
