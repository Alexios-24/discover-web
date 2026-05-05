"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FeedItem {
  id: number;
  initial: string;
  color: string;
  name: string;
  text: string;
  accent: string;
  time: string;
}

const TEMPLATES: Omit<FeedItem, "id" | "time">[] = [
  { initial: "SK", color: "#D6FF3A", name: "Sarah K.", text: "just sold her $497 cohort spot #12.", accent: "+$497" },
  { initial: "MR", color: "#FF3EB5", name: "Marcus R.", text: "'s community hit 1,000 members.", accent: "🎉" },
  { initial: "JL", color: "#7DD3FC", name: "Jamie L.", text: "launched Module 4 · 234 students enrolled.", accent: "+234" },
  { initial: "AV", color: "#FBBF24", name: "Alex V.", text: "paid out $8,420 this week.", accent: "+$8.4k" },
  { initial: "PN", color: "#A78BFA", name: "Priya N.", text: "started a live class · 178 watching.", accent: "LIVE" },
  { initial: "DK", color: "#FB7185", name: "Dev K.", text: "replied to 42 community questions today.", accent: "↳ 42" },
  { initial: "LC", color: "#34D399", name: "Lena C.", text: "just hit 10k followers 🚀", accent: "+10k" },
  { initial: "TK", color: "#F472B6", name: "Theo K.", text: "shipped a new lesson · feedback rolling in.", accent: "✦" },
];

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const initial: FeedItem[] = TEMPLATES.slice(0, 5).map((t, i) => ({
      ...t,
      id: i,
      time: `${i + 1}m`,
    }));
    setItems(initial);
    setCounter(5);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCounter((c) => {
        const tpl = TEMPLATES[c % TEMPLATES.length];
        const next: FeedItem = { ...tpl, id: c, time: "now" };
        setItems((prev) => [next, ...prev.slice(0, 4)].map((it, idx) => ({
          ...it,
          time: idx === 0 ? "now" : `${idx}m`,
        })));
        return c + 1;
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-32 px-10 bg-white text-ink overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-20 max-w-[1400px] mx-auto items-center">
        <div>
          <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-7">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse-dot inline-block" />
            <span className="w-6 h-px bg-lime" />
            <span>Real activity, right now</span>
          </div>
          <h2
            className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.95] text-ink mb-6"
            style={{ fontSize: "clamp(40px, 4vw, 68px)" }}
          >
            Every minute, creators{" "}
            <span className="italic font-medium text-magenta">ship</span>, sell, and grow.
          </h2>
          <p className="text-[16px] leading-[1.6] text-gray-600 max-w-[420px]">
            This is what's happening on GoKollab as you read this. Real creators. Real members. Real money. Real momentum.
          </p>
        </div>

        <div className="relative h-[420px]" style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}>
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -30, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }}
                  className={`flex items-center gap-3.5 px-5 py-4 rounded-[14px] border ${
                    i === 0
                      ? "border-lime bg-lime/10"
                      : "border-ink/10 bg-cream/60 backdrop-blur"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-montserrat font-extrabold text-[13px]"
                    style={{ background: item.color, color: "#000" }}
                  >
                    {item.initial}
                  </div>
                  <div className="flex-1 text-[14px] text-gray-600">
                    <span className="font-semibold text-ink">{item.name}</span> {item.text}
                  </div>
                  <div className="font-sans text-[11px] text-gray-400 shrink-0">
                    <span className={i === 0 ? "text-magenta font-semibold" : "text-ink/70"}>{item.accent}</span> · {item.time}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
