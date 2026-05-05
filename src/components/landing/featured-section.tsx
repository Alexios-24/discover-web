"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Category = "All" | "Finance" | "Wellness" | "Productivity" | "Creative" | "Tech" | "Gaming" | "Education";

const CATEGORIES: Category[] = ["All", "Finance", "Wellness", "Productivity", "Creative", "Tech", "Gaming", "Education"];

interface FeaturedProduct {
  title: string;
  creator: string;
  category: Category;
  members: string;
  pricing: string;
  type: "Community" | "Course";
  image: string;
  accent: "lime" | "magenta" | "cream";
}

const FEATURED: FeaturedProduct[] = [
  {
    title: "Cohort 5 — Build in Public",
    creator: "Sarah Khurana",
    category: "Finance",
    members: "2.4k",
    pricing: "$497",
    type: "Course",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=70",
    accent: "lime",
  },
  {
    title: "Designers who code",
    creator: "Marcus Reign",
    category: "Creative",
    members: "8.1k",
    pricing: "Free",
    type: "Community",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&auto=format&fit=crop&q=70",
    accent: "magenta",
  },
  {
    title: "Endurance lab",
    creator: "Jamie Liu",
    category: "Wellness",
    members: "22.3k",
    pricing: "$29/mo",
    type: "Community",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=70",
    accent: "cream",
  },
  {
    title: "Product manager OS",
    creator: "Alex Vega",
    category: "Productivity",
    members: "6.7k",
    pricing: "$197",
    type: "Course",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=70",
    accent: "lime",
  },
  {
    title: "Indie hackers café",
    creator: "Priya N.",
    category: "Tech",
    members: "18.9k",
    pricing: "Free",
    type: "Community",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=70",
    accent: "magenta",
  },
  {
    title: "Speedrun academy",
    creator: "Kai Mori",
    category: "Gaming",
    members: "9.8k",
    pricing: "$49/mo",
    type: "Community",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=70",
    accent: "cream",
  },
  {
    title: "Macro nutrition deep-dive",
    creator: "Lena Cruz",
    category: "Wellness",
    members: "31.5k",
    pricing: "$79",
    type: "Course",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=70",
    accent: "lime",
  },
  {
    title: "Storytelling for founders",
    creator: "Eva Black",
    category: "Education",
    members: "14.2k",
    pricing: "Free",
    type: "Community",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=70",
    accent: "magenta",
  },
];

export function FeaturedSection() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? FEATURED : FEATURED.filter((p) => p.category === active);

  return (
    <section className="relative py-32 px-10 bg-cream text-ink overflow-hidden">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-8">
        <span className="w-6 h-px bg-magenta" />
        <span>Featured this week</span>
      </div>

      {/* Headline + categories row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2
          className="font-montserrat font-extrabold tracking-[-0.04em] leading-[0.95] text-ink max-w-[900px]"
          style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
        >
          Picked for you. <span className="italic font-medium text-magenta">Loved</span> by thousands.
        </h2>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 font-sans text-[13px] text-ink underline-offset-4 hover:underline shrink-0"
        >
          See all →
        </Link>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2.5 mb-12">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-[18px] py-2.5 rounded-full font-sans text-[13px] border transition-all ${
                isActive
                  ? "border-ink bg-ink text-cream"
                  : "border-gray-300 bg-transparent text-gray-600 hover:border-ink hover:text-ink"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              layout
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] as const }}
            >
              <FeaturedCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function FeaturedCard({ product }: { product: FeaturedProduct }) {
  const [hovered, setHovered] = useState(false);
  const accentBg =
    product.accent === "lime" ? "bg-lime" : product.accent === "magenta" ? "bg-magenta" : "bg-cream border border-ink/10";
  const accentText = product.accent === "magenta" ? "text-cream" : "text-ink";

  return (
    <Link
      href="/discover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-ink/8">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent opacity-100 transition-opacity duration-300" />

        {/* Type tag */}
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full font-sans text-[10px] uppercase tracking-[0.18em] ${accentBg} ${accentText}`}
        >
          {product.type}
        </span>

        {/* Pricing */}
        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full font-sans text-[11px] bg-cream/95 text-ink backdrop-blur">
          {product.pricing}
        </span>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
          <h3 className="font-montserrat font-bold text-[20px] leading-[1.1] tracking-[-0.02em] mb-1">
            {product.title}
          </h3>
          <div className="flex items-center justify-between text-[12px] font-sans text-cream/80">
            <span>by {product.creator}</span>
            <span>{product.members} members</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-x-4 bottom-4 flex items-center justify-center bg-cream text-ink py-3 rounded-full font-bold text-[13px] transition-all duration-400 ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}
        >
          Open →
        </div>
      </div>
    </Link>
  );
}
