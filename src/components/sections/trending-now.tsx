"use client";

import { useEffect, useRef } from "react";
import { DiscoverCard } from "@/components/ui/discover-card";
import { TRENDING } from "@/lib/data";

export function TrendingNow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const isUserScrolling = useRef(false);
  const userScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSetScrollLeft = useRef(0);
  const doubled = [...TRENDING, ...TRENDING];

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

        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
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

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
          Trending now
        </h2>

        <div
          ref={scrollRef}
          onMouseEnter={() => {
            isHovering.current = true;
          }}
          onMouseLeave={() => {
            isHovering.current = false;
          }}
          className="no-scrollbar overflow-x-auto overflow-y-hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex w-max gap-6 max-md:gap-4">
            {doubled.map((card, idx) => (
              <DiscoverCard
                key={`${card.title}-${idx}`}
                {...card}
                className="w-[343px] shrink-0 max-md:w-[300px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
