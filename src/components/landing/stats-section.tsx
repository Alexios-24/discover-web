"use client";

import { useEffect, useRef, useState } from "react";

const METRICS = [
  { label: "Active creators", num: 158203, suffix: "", desc: "From 2,000 in March 2025 to 158,203 in 12 months." },
  { label: "Avg session", num: 23, suffix: "min", desc: "Highest engagement across creator platforms." },
  { label: "MAU growth", num: 106, suffix: "%", prefix: "+", desc: "Quarter-over-quarter. Not a vanity metric." },
  { label: "Platform fee", num: 0, suffix: "%", desc: "You keep what you earn. Always." },
];

export function StatsSection() {
  return (
    <section className="relative bg-ink text-cream overflow-hidden grain">
      {/* Top marquee */}
      <div className="border-y border-white/10 py-6 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 animate-marquee font-montserrat font-extrabold tracking-[-0.05em]"
          style={{ fontSize: "clamp(60px, 11vw, 160px)", lineHeight: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-12 shrink-0">
              <span className="text-lime">2,000</span>
              <span className="italic font-medium">→</span>
              <span className="text-lime">158,203</span>
              <span className="italic font-medium text-magenta">in 12 months</span>
              <span className="text-cream">+106% MAU</span>
              <span className="italic font-medium text-magenta">·</span>
              <span className="text-lime">23m 13s</span>
            </span>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 py-6 overflow-hidden whitespace-nowrap">
        <div
          className="inline-flex gap-12 animate-marquee-reverse font-montserrat font-extrabold tracking-[-0.05em]"
          style={{
            fontSize: "clamp(60px, 11vw, 160px)",
            lineHeight: 1,
            WebkitTextStroke: "2px #F5F3EE",
            color: "transparent",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-12 shrink-0">
              <span>communities</span>
              <span>·</span>
              <span>courses</span>
              <span>·</span>
              <span>cohorts</span>
              <span>·</span>
              <span>clubs</span>
              <span>·</span>
              <span>classes</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="px-10 py-32" style={{ background: "#050505" }}>
        <div className="text-center mb-20 max-w-[900px] mx-auto">
          <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-ink-dim mb-7">
            <span className="w-6 h-px bg-lime" />
            <span>By the numbers</span>
          </div>
          <h2
            className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.95]"
            style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
          >
            Numbers that{" "}
            <span className="italic font-medium text-lime">compound</span>. Engagement that sticks.
          </h2>
        </div>

        <div className="max-w-[1300px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10">
          {METRICS.map((m, i) => (
            <Metric key={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, num, prefix = "", suffix, desc }: { label: string; num: number; prefix?: string; suffix: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * num));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, num]);

  const formatted = count.toLocaleString();
  return (
    <div
      ref={ref}
      className="p-12 transition-colors duration-300 hover:bg-white/[0.03]"
      style={{ background: "#050505" }}
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-dim mb-4">{label}</p>
      <p className="font-montserrat font-extrabold tracking-[-0.04em] leading-[1] text-lime mb-2" style={{ fontSize: "64px" }}>
        {prefix}
        {formatted}
        <small className="text-[32px] text-ink-dim font-medium ml-0.5">{suffix}</small>
      </p>
      <p className="text-[14px] text-cream leading-[1.5] font-medium">{desc}</p>
    </div>
  );
}
