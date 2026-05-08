"use client";

import { Globe } from "lucide-react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

interface TopPickCard extends CardStackItem {
  pricing: string;
  members: string;
  gradientTo: string;
}

const CARDS: TopPickCard[] = [
  {
    id: "f1-enthusiasts",
    title: "F1 enthusiasts",
    pricing: "Free",
    members: "27.4K members",
    imageSrc:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=700&auto=format&fit=crop&q=80",
    gradientTo: "#393a3c",
  },
  {
    id: "ps5-officials",
    title: "PS5 officials",
    pricing: "Free",
    members: "27.4K members",
    imageSrc:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=700&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    id: "understanding-psychology",
    title: "Understanding human psychology",
    pricing: "Free",
    members: "27.4K members",
    imageSrc:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    id: "90s-games",
    title: "90s games",
    pricing: "Free",
    members: "27.4K members",
    imageSrc:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
  {
    id: "read-books",
    title: "How to read books effectively",
    pricing: "Free",
    members: "27.4K members",
    imageSrc:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=500&auto=format&fit=crop&q=80",
    gradientTo: "#011016",
  },
];

function TopPickCardRenderer(
  item: TopPickCard,
  { active }: { active: boolean },
) {
  const card = item;
  const isGlobe = card.pricing === "Free";

  return (
    <div className="relative h-full w-full overflow-hidden group/card">
      <div
        className={`absolute inset-0 transition-transform duration-500 ease-out ${
          active ? "group-hover/card:scale-110" : ""
        }`}
      >
        <img
          src={card.imageSrc}
          alt={card.title}
          className="h-full w-full object-cover"
          draggable={false}
          loading="eager"
        />
      </div>

      {/* Bottom gradient overlay matching Figma spec */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end p-4"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${card.gradientTo}80 47.77%, ${card.gradientTo} 100%)`,
        }}
      >
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h3
            className={`font-semibold text-white font-inter truncate ${
              active
                ? "text-[24px] leading-[32px]"
                : "text-[18px] leading-[28px]"
            }`}
          >
            {card.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-[2px] h-6 px-2 rounded-[12px] bg-white/25 shrink-0">
              {isGlobe && <Globe size={16} className="text-white" />}
              <span className="text-[13px] leading-[18px] font-medium text-white font-inter">
                {card.pricing}
              </span>
            </span>
            <span className="size-[6px] rounded-full bg-white/60 shrink-0" />
            <span className="text-[16px] leading-6 text-[#EAECF0] font-inter shrink-0">
              {card.members}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopPicksSection() {
  return (
    <section className="w-full pt-24 pb-36 bg-white overflow-hidden">
      <div className="flex flex-col items-center gap-6 w-full">
        <h2 className="font-montserrat font-bold text-[40px] leading-normal text-[#101828] text-center w-full px-[54px]">
          Top picks for you
        </h2>

        <div className="w-full max-w-5xl mx-auto">
          <CardStack<TopPickCard>
            items={CARDS}
            initialIndex={0}
            autoAdvance
            intervalMs={3000}
            pauseOnHover
            showDots
            loop
            cardWidth={500}
            cardHeight={281}
            overlap={0.46}
            spreadDeg={24}
            perspectivePx={1100}
            depthPx={120}
            tiltXDeg={10}
            activeLiftPx={33}
            activeScale={1.0}
            inactiveScale={0.94}
            springStiffness={160}
            springDamping={22}
            maxVisible={5}
            scatterOnView
            scatterDelayMs={300}
            renderCard={(item, state) =>
              TopPickCardRenderer(item, state)
            }
          />
        </div>
      </div>
    </section>
  );
}
