"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  X,
  ArrowDownUp,
  ChevronDown,
  ListFilter,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FiltersPanel,
  FiltersDrawerBody,
  clearFilters,
  hasActiveFilters,
  type FilterState,
} from "./filters-panel";
import { TopPicks } from "./top-picks";
import { TrendingNow } from "./trending-now";
import { CreatorsYouMightLike } from "./creators";
import { BrowseProducts } from "./browse-products";
import { FilteredResults } from "./filtered-results";
import { BottomDrawer } from "@/components/ui/bottom-drawer";

const PRODUCT_TABS = ["All", "Communities", "Courses", "Creators"];

type SortOption = "relevant" | "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const DEFAULT_SORT: SortOption = "relevant";

function sortLabel(value: SortOption): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Most relevant";
}

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

interface MobileChipProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function MobileChip({ icon, label, active, onClick }: MobileChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-0.5 h-7 px-2 rounded-[14px] border shrink-0 transition-colors",
        active
          ? "bg-indigo-50 border-indigo-300 text-indigo-600"
          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50",
      )}
    >
      <span className="flex items-center justify-center w-[18px] h-[18px] shrink-0">
        {icon}
      </span>
      <span className="text-[14px] leading-5 font-medium text-center whitespace-nowrap">
        {label}
      </span>
      <span className="flex items-center justify-center w-[18px] h-[18px] shrink-0">
        <ChevronDown size={14} strokeWidth={2} />
      </span>
    </button>
  );
}

export function DiscoverContent() {
  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState<FilterState>(clearFilters);
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams?.get("q") ?? "";
  const hasQuery = query.length > 0;

  const isActive = hasActiveFilters(filters);
  const isSortActive = sort !== DEFAULT_SORT;
  const tags = isActive ? getFilterTags(filters, setFilters) : [];

  return (
    <div className="flex gap-[54px] items-start pt-6 px-[54px] pb-9 max-lg:gap-6 max-md:px-4 max-md:pt-6 max-md:pb-6">
      {/* Desktop sidebar filters — hidden below lg */}
      <div className="max-lg:hidden sticky top-[84px] self-start">
        <FiltersPanel filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-6 items-start max-md:gap-4">
        {/* Product type switcher + Sort */}
        <div className="flex items-center justify-between w-full sticky top-[60px] z-40 bg-white py-3 relative max-md:flex-col max-md:items-stretch max-md:gap-4 max-md:py-2">
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

          {/* Desktop sort dropdown — hidden on mobile */}
          <button className="flex flex-col items-start w-[165px] shrink-0 cursor-pointer max-md:hidden">
            <div className="bg-white border border-gray-200 flex gap-2 h-9 items-center overflow-hidden px-3 py-2 rounded-lg shadow-xs w-full">
              <div className="flex flex-1 gap-2 items-center min-w-0">
                <ArrowDownUp size={20} className="text-gray-900 shrink-0" />
                <span className="text-[14px] leading-5 font-normal text-gray-900 whitespace-nowrap">
                  {sortLabel(sort)}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-900 shrink-0" />
            </div>
          </button>

          {/* Mobile chips row — Filter + Sort */}
          <div className="hidden max-md:flex items-center gap-2 self-start">
            <MobileChip
              icon={<ListFilter size={18} strokeWidth={2} />}
              label="Filters"
              active={isActive}
              onClick={() => setFiltersDrawerOpen(true)}
            />
            <MobileChip
              icon={<ArrowDownUp size={18} strokeWidth={2} />}
              label={sortLabel(sort)}
              active={isSortActive}
              onClick={() => setSortDrawerOpen(true)}
            />
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-[54px] w-full max-md:gap-10">
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

      {/* Mobile filters drawer */}
      <BottomDrawer
        open={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        title="Filters"
        hideCloseButton
        hideHeaderDivider
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setFilters(clearFilters())}
              disabled={!isActive}
              className="flex-1 inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-md border border-gray-300 bg-white text-[16px] leading-6 font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-md bg-indigo-600 border border-indigo-600 text-[16px] leading-6 font-semibold text-white shadow-xs hover:bg-indigo-600/90 transition-colors"
            >
              Show results
            </button>
          </div>
        }
      >
        <FiltersDrawerBody filters={filters} onFiltersChange={setFilters} />
      </BottomDrawer>

      {/* Mobile sort drawer */}
      <BottomDrawer
        open={sortDrawerOpen}
        onClose={() => setSortDrawerOpen(false)}
        title="Sort by"
      >
        <div className="flex flex-col">
          {SORT_OPTIONS.map((option) => {
            const selected = sort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSort(option.value);
                  setSortDrawerOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between gap-3 w-full px-2 py-3 rounded-md text-left transition-colors",
                  selected ? "text-indigo-600" : "text-gray-900 hover:bg-gray-50",
                )}
              >
                <span className="text-[15px] leading-5 font-medium">
                  {option.label}
                </span>
                {selected && (
                  <Check size={18} strokeWidth={2.25} className="text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </BottomDrawer>
    </div>
  );
}
