"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, ArrowDownUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FiltersPanel, hasActiveFilters, type FilterState } from "./filters-panel";
import { TopPicks } from "./top-picks";
import { TrendingNow } from "./trending-now";
import { CreatorsYouMightLike } from "./creators";
import { BrowseProducts } from "./browse-products";
import { FilteredResults } from "./filtered-results";

const PRODUCT_TABS = ["All", "Communities", "Courses", "Creators"];

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-6 px-3 bg-white border border-gray-300 rounded-xl shrink-0">
      <span className="text-[13px] leading-[18px] font-medium text-gray-600 whitespace-nowrap">
        {label}
      </span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-[11px] h-[11px] opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
      >
        <X size={9} className="text-gray-600" />
      </button>
    </div>
  );
}

function getFilterTags(
  filters: FilterState,
  setFilters: (f: FilterState) => void,
) {
  const tags: { label: string; onRemove: () => void }[] = [];

  for (const v of filters.categories) {
    tags.push({
      label: v,
      onRemove: () =>
        setFilters({
          ...filters,
          categories: filters.categories.filter((x) => x !== v),
        }),
    });
  }
  for (const v of filters.collection) {
    tags.push({
      label: v,
      onRemove: () =>
        setFilters({
          ...filters,
          collection: filters.collection.filter((x) => x !== v),
        }),
    });
  }
  for (const v of filters.access) {
    tags.push({
      label: v,
      onRemove: () =>
        setFilters({
          ...filters,
          access: filters.access.filter((x) => x !== v),
        }),
    });
  }
  for (const v of filters.price) {
    tags.push({
      label: v,
      onRemove: () =>
        setFilters({
          ...filters,
          price: filters.price.filter((x) => x !== v),
        }),
    });
  }
  if (filters.priceMin > 0 || filters.priceMax < 5000) {
    tags.push({
      label: `$${filters.priceMin.toLocaleString()} - $${filters.priceMax.toLocaleString()}`,
      onRemove: () =>
        setFilters({ ...filters, priceMin: 0, priceMax: 5000 }),
    });
  }

  return tags;
}

export function DiscoverContent() {
  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    collection: [],
    access: [],
    price: [],
    priceMin: 0,
    priceMax: 5000,
  });

  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";
  const hasQuery = query.length > 0;

  const isActive = hasActiveFilters(filters);
  const tags = isActive ? getFilterTags(filters, setFilters) : [];

  return (
    <div className="flex gap-[54px] items-start pt-6 px-[54px] pb-9 max-lg:gap-6 max-md:px-4 max-md:pt-4 max-md:pb-6">
      {/* Desktop sidebar filters — hidden below lg (mobile users get them as a sheet via the discover header) */}
      <div className="max-lg:hidden">
        <FiltersPanel filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-6 items-start max-md:gap-4">
        {/* Product type switcher + Sort */}
        <div className="flex items-center justify-between w-full sticky top-[60px] z-40 bg-white py-3 relative max-md:flex-col max-md:items-stretch max-md:gap-3">
          <div className="absolute inset-y-0 -right-[54px] w-[54px] bg-white max-md:hidden" />
          <div className="bg-gray-100 flex items-center justify-center overflow-hidden p-1 rounded-xl w-[406px] max-md:w-full">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center justify-center py-1.5 rounded-[20px] text-[14px] leading-5 font-medium text-gray-900 transition-colors whitespace-nowrap",
                  tab === "All" ? "px-6 max-md:flex-1 max-md:px-3" : "flex-1 min-w-0 px-3",
                  activeTab === tab && "bg-white shadow-xs rounded-lg",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex flex-col items-start w-[165px] shrink-0 cursor-pointer max-md:w-full">
            <div className="bg-white border border-gray-200 flex gap-2 h-9 items-center overflow-hidden px-3 py-2 rounded-lg shadow-xs w-full">
              <div className="flex flex-1 gap-2 items-center min-w-0">
                <ArrowDownUp size={20} className="text-gray-900 shrink-0" />
                <span className="text-[14px] leading-5 font-normal text-gray-900 whitespace-nowrap">
                  Most relevant
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-900 shrink-0" />
            </div>
          </button>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-[54px] w-full">
          {hasQuery ? (
            <>
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <FilterTag
                      key={i}
                      label={tag.label}
                      onRemove={tag.onRemove}
                    />
                  ))}
                </div>
              )}
              <BrowseProducts />
            </>
          ) : isActive ? (
            <>
              <div className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <FilterTag key={i} label={tag.label} onRemove={tag.onRemove} />
                  ))}
                </div>
                <FilteredResults />
              </div>
              <CreatorsYouMightLike />
            </>
          ) : (
            <>
              <TopPicks />
              <TrendingNow />
              <CreatorsYouMightLike />
              <BrowseProducts />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
