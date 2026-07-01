"use client";

import { useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FilterSectionProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

function FilterSection({ label, options, selected, onToggle }: FilterSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <span className="text-[13px] leading-[18px] font-medium text-gray-500">
            {label}
          </span>
          {open ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {open && (
          <div className="flex flex-col gap-3 w-full">
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <label
                  key={option}
                  className="flex items-center gap-1 h-[18px] cursor-pointer w-full"
                >
                  <span
                    className={`flex items-center justify-center w-[14px] h-[14px] rounded-[3px] border shrink-0 ${
                      checked
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    {checked && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 3L3 5L7 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option)}
                    className="sr-only"
                  />
                  <span className="text-[13px] leading-[18px] text-gray-900">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      <div className="h-px w-full bg-gray-200" />
    </div>
  );
}

interface PriceRangeProps {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}

function PriceRangeSection({ min, max, onMinChange, onMaxChange }: PriceRangeProps) {
  const [open, setOpen] = useState(true);
  const MAX_VALUE = 5000;

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMaxChange(Number(e.target.value));
    },
    [onMaxChange],
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <span className="text-[13px] leading-[18px] font-medium text-gray-500">
          Price range
        </span>
        {open ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-3 w-full">
          <div className="relative w-full h-7 flex items-center">
            <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-lg" />
            <div
              className="absolute left-0 h-1 bg-indigo-600 rounded-lg"
              style={{ width: `${(max / MAX_VALUE) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={MAX_VALUE}
              value={max}
              onChange={handleSliderChange}
              className="absolute left-0 right-0 w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 min-w-0 h-8 bg-white border border-gray-300 rounded px-2 flex items-center gap-1 shadow-xs">
              <span className="text-[13px] leading-[18px] text-gray-500">$</span>
              <input
                type="number"
                value={min}
                onChange={(e) => onMinChange(Number(e.target.value))}
                className="flex-1 min-w-0 text-[13px] leading-[18px] text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1 min-w-0 h-8 bg-white border border-gray-300 rounded px-2 flex items-center gap-1 shadow-xs">
              <span className="text-[13px] leading-[18px] text-gray-500">$</span>
              <input
                type="number"
                value={max}
                onChange={(e) => onMaxChange(Number(e.target.value))}
                className="flex-1 min-w-0 text-[13px] leading-[18px] text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface FilterState {
  categories: string[];
  collection: string[];
  access: string[];
  price: string[];
  priceMin: number;
  priceMax: number;
}

export const CATEGORY_FILTER_OPTIONS = [
  "Entrepreneurship",
  "Marketing",
  "Productivity",
  "Technology",
  "Wellness",
  "Creative",
  "Leadership",
  "Miscellaneous",
];

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.categories.length > 0 ||
    filters.collection.length > 0 ||
    filters.access.length > 0 ||
    filters.price.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 5000
  );
}

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function clearFilters(): FilterState {
  return {
    categories: [],
    collection: [],
    access: [],
    price: [],
    priceMin: 0,
    priceMax: 5000,
  };
}

export function FiltersPanelBody({ filters, onFiltersChange }: FiltersPanelProps) {
  const toggleFilter = (
    key: "categories" | "collection" | "access" | "price",
    value: string,
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <>
      <FilterSection
        label="Browse categories"
        options={CATEGORY_FILTER_OPTIONS}
        selected={filters.categories}
        onToggle={(v) => toggleFilter("categories", v)}
      />
      <FilterSection
        label="Collection"
        options={["Featured", "Trending", "Popular"]}
        selected={filters.collection}
        onToggle={(v) => toggleFilter("collection", v)}
      />
      <FilterSection
        label="Access"
        options={["Public", "Private"]}
        selected={filters.access}
        onToggle={(v) => toggleFilter("access", v)}
      />
      <FilterSection
        label="Price"
        options={["Free", "Paid"]}
        selected={filters.price}
        onToggle={(v) => toggleFilter("price", v)}
      />
      <PriceRangeSection
        min={filters.priceMin}
        max={filters.priceMax}
        onMinChange={(v) => onFiltersChange({ ...filters, priceMin: v })}
        onMaxChange={(v) => onFiltersChange({ ...filters, priceMax: v })}
      />
    </>
  );
}

interface DrawerSectionProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  showDivider?: boolean;
}

function DrawerCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex items-center justify-center w-4 h-4 rounded-[4px] border shrink-0 ${
        checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-400"
      }`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.6667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

function DrawerSectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full cursor-pointer"
    >
      <span className="text-[14px] leading-5 font-medium text-gray-500">
        {label}
      </span>
      {open ? (
        <ChevronUp size={16} className="text-gray-500" strokeWidth={1.67} />
      ) : (
        <ChevronDown size={16} className="text-gray-500" strokeWidth={1.67} />
      )}
    </button>
  );
}

function DrawerFilterSection({
  label,
  options,
  selected,
  onToggle,
  showDivider = true,
}: DrawerSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3 w-full">
        <DrawerSectionHeader label={label} open={open} onToggle={() => setOpen(!open)} />
        {open && (
          <div className="flex flex-col gap-3 w-full">
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <label
                  key={option}
                  className="flex items-center gap-1 h-5 cursor-pointer w-full"
                >
                  <DrawerCheckbox checked={checked} />
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option)}
                    className="sr-only"
                  />
                  <span className="text-[14px] leading-5 text-gray-900">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      {showDivider && <div className="h-px w-full bg-gray-200" />}
    </div>
  );
}

interface DrawerPriceRangeProps {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}

function DrawerPriceRangeSection({
  min,
  max,
  onMinChange,
  onMaxChange,
}: DrawerPriceRangeProps) {
  const [open, setOpen] = useState(true);
  const MAX_VALUE = 5000;

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMaxChange(Number(e.target.value));
    },
    [onMaxChange],
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <DrawerSectionHeader
        label="Price range"
        open={open}
        onToggle={() => setOpen(!open)}
      />

      {open && (
        <>
          <div className="relative w-full h-7 flex items-center">
            <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-lg" />
            <div
              className="absolute left-0 h-1 bg-indigo-600 rounded-lg"
              style={{ width: `${(max / MAX_VALUE) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={MAX_VALUE}
              value={max}
              onChange={handleSliderChange}
              aria-label="Maximum price"
              className="absolute left-0 right-0 w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-indigo-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 min-w-0 h-8 bg-white border border-gray-300 rounded-[4px] px-2 flex items-center gap-2 shadow-xs">
              <span className="text-[13px] leading-[18px] text-gray-500 shrink-0">$</span>
              <input
                type="number"
                value={min}
                onChange={(e) => onMinChange(Number(e.target.value))}
                aria-label="Minimum price"
                className="flex-1 min-w-0 text-[13px] leading-[18px] text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1 min-w-0 h-8 bg-white border border-gray-300 rounded-[4px] px-2 flex items-center gap-2 shadow-xs">
              <span className="text-[13px] leading-[18px] text-gray-500 shrink-0">$</span>
              <input
                type="number"
                value={max}
                onChange={(e) => onMaxChange(Number(e.target.value))}
                aria-label="Maximum price"
                className="flex-1 min-w-0 text-[13px] leading-[18px] text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function FiltersDrawerBody({ filters, onFiltersChange }: FiltersPanelProps) {
  const toggleFilter = (
    key: "categories" | "collection" | "access" | "price",
    value: string,
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <div className="flex flex-col gap-6 items-start w-full">
      <DrawerFilterSection
        label="Browse categories"
        options={CATEGORY_FILTER_OPTIONS}
        selected={filters.categories}
        onToggle={(v) => toggleFilter("categories", v)}
      />
      <DrawerFilterSection
        label="Collection"
        options={["Featured", "Trending", "Popular"]}
        selected={filters.collection}
        onToggle={(v) => toggleFilter("collection", v)}
      />
      <DrawerFilterSection
        label="Access"
        options={["Public", "Private"]}
        selected={filters.access}
        onToggle={(v) => toggleFilter("access", v)}
      />
      <DrawerFilterSection
        label="Price"
        options={["Free", "Paid"]}
        selected={filters.price}
        onToggle={(v) => toggleFilter("price", v)}
      />
      <DrawerPriceRangeSection
        min={filters.priceMin}
        max={filters.priceMax}
        onMinChange={(v) => onFiltersChange({ ...filters, priceMin: v })}
        onMaxChange={(v) => onFiltersChange({ ...filters, priceMax: v })}
      />
    </div>
  );
}

const SIDEBAR_TOP_OFFSET = 84;

export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const isActive = hasActiveFilters(filters);

  return (
    <aside
      className="flex flex-col gap-6 w-[200px] shrink-0 overflow-x-hidden overflow-y-auto pt-2"
      style={{ maxHeight: `calc(100vh - ${SIDEBAR_TOP_OFFSET}px)` }}
    >
      <div className="flex items-center justify-between h-[22px] w-full">
        <span className="text-[14px] leading-5 font-semibold text-gray-900">
          Filters
        </span>
        {isActive && (
          <button
            onClick={() => onFiltersChange(clearFilters())}
            className="text-[13px] leading-[18px] font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <FiltersPanelBody filters={filters} onFiltersChange={onFiltersChange} />
    </aside>
  );
}
