"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export function FinalCTA() {
  return (
    <section className="relative py-48 px-10 bg-cream text-ink overflow-hidden text-center">
      {/* Lime orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800,
          height: 800,
          top: "50%",
          left: "50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #D6FF3A 0%, transparent 60%)",
          filter: "blur(120px)",
          opacity: 0.3,
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Magenta orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: "30%",
          right: "10%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF3EB5 0%, transparent 60%)",
          filter: "blur(100px)",
          opacity: 0.18,
        }}
      />

      <p className="relative z-10 font-sans text-[13px] uppercase tracking-[0.2em] text-ink mb-10">
        Free forever. No credit card.
      </p>

      <h2
        className="relative z-10 font-montserrat font-extrabold tracking-[-0.05em] leading-[0.85] mb-14"
        style={{ fontSize: "clamp(80px, 13vw, 220px)" }}
      >
        Your <span className="italic font-medium text-magenta">turn</span>.
      </h2>

      <MegaButton href="/discover">
        <span>Start building on GoKollab</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MegaButton>
    </section>
  );
}

function MegaButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.18, y: y * 0.28 });
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className="relative z-10 inline-flex items-center gap-3.5 px-12 py-7 bg-lime text-ink rounded-full font-extrabold tracking-[-0.02em] text-[24px] overflow-hidden transition-transform duration-200 group"
    >
      <span className="absolute inset-0 bg-magenta translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />
      <span className="relative z-10 group-hover:text-cream transition-colors">{children}</span>
    </Link>
  );
}
