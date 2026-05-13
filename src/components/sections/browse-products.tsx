"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { DiscoverCard } from "@/components/ui/discover-card";
import { BROWSE_PRODUCTS } from "@/lib/data";

const PAGE_SIZE = 6;
const LOAD_DELAY_MS = 800;

export function BrowseProducts() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < BROWSE_PRODUCTS.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, BROWSE_PRODUCTS.length)
      );
      setIsLoading(false);
    }, LOAD_DELAY_MS);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleProducts = BROWSE_PRODUCTS.slice(0, visibleCount);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
            Browse products
          </h2>
          <a
            href="#"
            className="text-[13px] leading-[18px] font-medium text-indigo-600 hover:underline"
          >
            See all
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
          {visibleProducts.map((card, idx) => (
            <DiscoverCard key={`${card.title}-${idx}`} {...card} />
          ))}
        </div>

        {/* Sentinel + loader */}
        {hasMore && (
          <div ref={sentinelRef} className="flex items-center justify-center py-8">
            {isLoading && (
              <Loader2
                size={24}
                className="text-indigo-600 animate-spin"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
