"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CREATORS } from "@/lib/data";

export function CreatorsYouMightLike() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
            Creators you might like
          </h2>
          <div className="flex items-center gap-1 max-md:hidden">
            <button
              onClick={() => scrollBy(-200)}
              className="flex items-center justify-center w-8 h-8 rounded overflow-hidden hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <button
              onClick={() => scrollBy(200)}
              className="flex items-center justify-center w-8 h-8 rounded overflow-hidden hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Desktop: horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-6 items-start overflow-x-auto overflow-y-hidden max-md:hidden"
        >
          {CREATORS.map((creator, idx) => (
            <CreatorCard key={idx} {...creator} />
          ))}
        </div>

        {/* Mobile: 2-column grid */}
        <div className="hidden max-md:grid grid-cols-2 gap-x-6 gap-y-4">
          {CREATORS.map((creator, idx) => (
            <CreatorCard key={idx} {...creator} mobile />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CreatorCardProps {
  name: string;
  role: string;
  image: string;
  mobile?: boolean;
}

function CreatorCard({ name, role, image, mobile = false }: CreatorCardProps) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-1 items-start min-w-0 cursor-pointer w-full">
        <div className="w-full aspect-[179/240] rounded-2xl overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <p className="text-[16px] leading-6 font-semibold text-gray-900 truncate w-full">
            {name}
          </p>
          <p className="text-[14px] leading-5 text-gray-600 truncate w-full">
            {role}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-start shrink-0 cursor-pointer">
      <div className="w-[168.5px] h-[224.667px] rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start w-[168.5px]">
        <p className="text-[16px] leading-6 font-semibold text-gray-900 truncate w-full">
          {name}
        </p>
        <p className="text-[14px] leading-5 text-gray-600 truncate w-full">
          {role}
        </p>
      </div>
    </div>
  );
}
