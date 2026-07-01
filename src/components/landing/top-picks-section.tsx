"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { useVariant } from "@/components/landing/variant-switcher";

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

const V1_TRENDING_CARDS = [
  {
    id: "red-dead-redemption",
    title: "Red dead redemption",
    pricing: "Free",
    members: "27.4K members",
    imageSrc: "/trending/trending-red-dead-redemption.jpg",
    gradientTo: "#1c0106",
  },
  {
    id: "frontend-masters",
    title: "Frontend masters",
    pricing: "Free",
    members: "27.4K members",
    imageSrc: "/trending/trending-3.jpg",
    gradientTo: "#011016",
  },
  {
    id: "f1-enthusiasts",
    title: "F1 enthusiasts",
    pricing: "Free",
    members: "27.4K members",
    imageSrc: "/trending/trending-f1-enthusiasts.jpg",
    gradientTo: "#011016",
  },
] as const;

function SimpleTrendingCard({
  card,
}: {
  card: (typeof V1_TRENDING_CARDS)[number];
}) {
  const isGlobe = card.pricing === "Free";

  return (
    <article className="group relative aspect-[1600/900] min-w-0 flex-1 overflow-hidden rounded-[16px]">
      <img
        src={card.imageSrc}
        alt={card.title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
        loading="eager"
      />

      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${card.gradientTo}80 47.769%, ${card.gradientTo} 100%)`,
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <h3 className="truncate font-inter text-[20px] font-semibold leading-[30px] text-white max-md:text-[18px] max-md:leading-6">
            {card.title}
          </h3>
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 min-h-6 shrink-0 items-center justify-center gap-0.5 rounded-full bg-white/25 px-2 max-md:h-5 max-md:min-h-5 max-md:px-1.5">
              {isGlobe ? (
                <Globe size={16} className="text-white max-md:size-3" />
              ) : null}
              <span className="font-inter text-[13px] font-medium leading-[18px] text-white max-md:text-[11px] max-md:leading-[14px]">
                {card.pricing}
              </span>
            </span>
            <span className="size-1.5 shrink-0 rounded-full bg-white/60 max-md:size-1" />
            <span className="truncate font-inter text-[16px] leading-6 text-[#eaecf0] max-md:text-[12px] max-md:leading-4">
              {card.members}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-[8px] border border-[#d0d5dd] bg-white px-[14px] py-2 font-inter text-[14px] font-semibold leading-5 text-[#344054] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:bg-gray-50 max-md:hidden"
        >
          Join now
        </button>
      </div>
    </article>
  );
}

function SimpleTrendingSection() {
  return (
    <section className="w-full bg-white pt-16 pb-24 max-md:pt-12 max-md:pb-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-[54px] max-md:gap-5 max-md:px-4">
        <h2 className="w-full text-center font-montserrat text-[36px] font-semibold leading-normal text-[#101828] max-md:text-[24px] max-md:leading-[32px]">
          Trending now
        </h2>

        <div className="flex w-full gap-6 max-md:flex-col max-md:gap-4">
          {V1_TRENDING_CARDS.map((card) => (
            <SimpleTrendingCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
            className={`font-semibold text-white font-inter truncate max-md:!text-[15px] max-md:!leading-[20px] ${
              active
                ? "text-[24px] leading-[32px]"
                : "text-[18px] leading-[28px]"
            }`}
          >
            {card.title}
          </h3>
          <div className="flex items-center gap-2 max-md:gap-1.5">
            <span className="flex items-center gap-[2px] h-6 px-2 rounded-[12px] bg-white/25 shrink-0 max-md:h-5 max-md:px-1.5 max-md:rounded-[10px]">
              {isGlobe && <Globe size={16} className="text-white max-md:size-3" />}
              <span className="text-[13px] leading-[18px] font-medium text-white font-inter max-md:text-[11px] max-md:leading-[14px]">
                {card.pricing}
              </span>
            </span>
            <span className="size-[6px] rounded-full bg-white/60 shrink-0 max-md:size-[4px]" />
            <span className="text-[16px] leading-6 text-[#EAECF0] font-inter shrink-0 max-md:text-[12px] max-md:leading-4 max-md:truncate">
              {card.members}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function useCardDims(): { w: number; h: number; isMobile: boolean } {
  const [dims, setDims] = useState({ w: 500, h: 281, isMobile: false });
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      if (vw < 640) {
        // Mobile: fit comfortably in viewport (with side margin for stacked neighbours)
        const w = Math.min(280, vw - 80);
        setDims({ w, h: Math.round(w * (281 / 500)), isMobile: true });
      } else if (vw < 1024) {
        setDims({ w: 380, h: 214, isMobile: false });
      } else {
        setDims({ w: 500, h: 281, isMobile: false });
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return dims;
}

export function TopPicksSection() {
  const { variant } = useVariant();

  if (variant === "v1") {
    return <SimpleTrendingSection />;
  }

  return <StackTrendingSection />;
}

function StackTrendingSection() {
  const { w, h, isMobile } = useCardDims();

  return (
    <section className="w-full pt-24 pb-36 bg-white overflow-hidden max-md:pt-14 max-md:pb-20">
      <div className="flex flex-col items-center gap-6 w-full max-md:gap-4">
        <h2 className="font-montserrat font-semibold text-[36px] leading-normal text-[#101828] text-center w-full px-[54px] max-md:text-[24px] max-md:leading-[32px] max-md:px-4">
          Trending now
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
            cardWidth={w}
            cardHeight={h}
            // Mobile stack is much shorter than desktop's 320-px cards, so
            // shrink the container height proportionally to remove the big
            // gap that the desktop-tuned 380-px minimum produced.
            containerMinHeight={isMobile ? h + 60 : undefined}
            overlap={0.46}
            spreadDeg={24}
            perspectivePx={1100}
            depthPx={120}
            tiltXDeg={10}
            activeLiftPx={isMobile ? 18 : 33}
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
