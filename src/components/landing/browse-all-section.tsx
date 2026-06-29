"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { DiscoverCard } from "@/components/ui/discover-card";
import { BROWSE_PRODUCTS } from "@/lib/data";

const TABS = ["All", "Communities", "Courses", "Creators"];
const TAGS = [
  "All categories",
  "Finance",
  "Travel",
  "Technology",
  "Productivity",
  "Creative",
  "Gaming",
  "Wellness",
  "Leadership",
  "Miscellaneous",
];

const VISIBLE_CARDS = BROWSE_PRODUCTS.slice(0, 8);

export function BrowseAllSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white pt-24 pb-16 overflow-hidden max-md:pt-14 max-md:pb-10">
      <div className="max-w-[1440px] mx-auto px-[54px] flex flex-col gap-8 max-md:px-4 max-md:gap-5">
        <h2 className="font-montserrat font-semibold text-[40px] leading-normal text-[#101828] text-center max-md:text-[24px] max-md:leading-[32px]">
          Browse all
        </h2>

        {/* Filters Row — stacks below md so the tabs + tag carousel don't get cramped */}
        <div className="flex gap-3 items-center w-full max-md:flex-col max-md:items-stretch max-md:gap-3">
          {/* Product type switcher — full-width segmented control on mobile */}
          <div className="bg-[#F2F4F7] flex items-center p-1 rounded-[12px] shrink-0 max-md:w-full max-md:overflow-x-auto max-md:no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-6 py-1.5 rounded-[8px] text-[14px] leading-[20px] font-medium font-inter transition-colors whitespace-nowrap max-md:flex-1 max-md:px-3 ${
                  tab === "All"
                    ? "bg-white text-[#101828] shadow-sm"
                    : "text-[#475467] hover:text-[#101828]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Divider — hidden on mobile (filters are stacked) */}
          <div className="w-px h-6 bg-[#EAECF0] shrink-0 max-md:hidden" />

          {/* Tags Carousel */}
          <div className="flex-1 flex items-center gap-1 min-w-0 relative">
            {canScrollLeft && (
              <>
                <button 
                  onClick={() => scroll("left")}
                  className="absolute left-0 shrink-0 flex items-center justify-center w-8 h-8 rounded-[4px] bg-white hover:bg-gray-50 text-[#667085] z-10"
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <div className="absolute left-8 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-[5]" />
              </>
            )}
            
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className={`flex items-center gap-3 overflow-x-auto no-scrollbar w-full ${canScrollLeft ? 'pl-12' : ''} ${canScrollRight ? 'pr-12' : ''}`}
            >
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`shrink-0 h-[32px] px-3 rounded-full text-[14px] leading-[20px] font-medium font-inter border transition-colors flex items-center justify-center ${
                    tag === "All categories"
                      ? "bg-[#EFF0FD] text-[#343DE5] border-transparent"
                      : "bg-white border-[#EAECF0] text-[#475467] hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <>
                <div className="absolute right-8 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-[5]" />
                <button 
                  onClick={() => scroll("right")}
                  className="absolute right-0 shrink-0 flex items-center justify-center w-8 h-8 rounded-[4px] bg-white hover:bg-gray-50 text-[#667085] z-10"
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Responsive Cards Grid:
            - Uses CSS grid with auto-fill and minmax for fully responsive cards
            - Cards stretch from 280px to 1fr, filling the container at any width
            - At very wide viewports, shows 4 columns; at narrow, 2 columns */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 w-full max-md:grid-cols-1 max-md:gap-4">
          {VISIBLE_CARDS.map((card, idx) => (
            <DiscoverCard key={`${card.title}-${idx}`} {...card} />
          ))}
        </div>

        {/* Footer Button */}
        <div className="flex justify-center w-full">
          <Link href="/discover" className="flex items-center gap-2 px-3.5 py-2 bg-[#F2F4F7] border border-[#F9FAFB] rounded-[8px] hover:bg-[#E4E7EC] transition-colors">
            <span className="font-semibold text-[14px] leading-[20px] text-[#344054] font-inter">
              See all products
            </span>
            <ChevronRight size={16} strokeWidth={2} className="text-[#344054]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
