"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/sections/app-header";
import { DiscoverCard } from "@/components/ui/discover-card";
import { TOP_PICKS_LANDING } from "@/lib/data";

// Flow B landing — "Top picks based on your interests" (Figma node 2942:30174).
// Shown after the discover/learn personalizing animation. "Explore more" opens
// the full logged-in Discover (Figma node 2942:28623).
export default function PicksPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <AppHeader variant="minimal" />
      <div className="mx-auto w-full max-w-[1440px] px-[54px] py-6 max-md:px-4">
        {/* Hero */}
        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <h1 className="font-montserrat text-[34px] font-bold leading-tight text-gray-900 sm:text-[40px]">
            Top picks based on your interests
          </h1>
          <p className="text-[16px] leading-6 text-gray-900">
            Find communities, courses, and creators that transform your life.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TOP_PICKS_LANDING.map((card, index) => (
            <DiscoverCard key={index} {...card} className="min-w-0" />
          ))}
        </div>

        {/* Explore more */}
        <div className="flex items-center justify-center py-4">
          <Link
            href="/discover?app=1"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-50 bg-gray-100 px-[14px] py-2 text-[14px] font-semibold leading-5 text-gray-700 transition-colors hover:bg-gray-200"
          >
            Explore more
            <ArrowRight size={20} strokeWidth={1.85} />
          </Link>
        </div>
      </div>
    </main>
  );
}
