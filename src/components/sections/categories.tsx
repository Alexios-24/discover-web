"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCT_TABS = ["All", "Communities", "Courses", "Creators"];

export function CategorySwitcher() {
  const [activeTab, setActiveTab] = useState("All");
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("category-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: "-60px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn(
        "w-full sticky top-[60px] z-40 transition-all duration-300 ease-out",
        isStuck ? "py-4" : "py-9",
      )}
      style={{
        backgroundColor: "#ffffff",
        boxShadow: isStuck
          ? "0px 1px 3px rgba(16,24,40,0.06), 0px 1px 2px rgba(16,24,40,0.04)"
          : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between w-full px-[54px] max-md:px-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
        <div className="bg-gray-100 flex items-center justify-center p-1 rounded-xl shrink-0 max-md:w-full">
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center justify-center px-4 py-1.5 rounded-lg text-[14px] leading-5 font-medium text-gray-900 transition-colors",
                activeTab === tab && "bg-white shadow-xs",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-0.5 h-6 px-3 bg-white border border-gray-300 rounded-xl shrink-0 cursor-pointer">
          <ArrowDownUp size={16} className="text-gray-600" />
          <span className="text-[13px] leading-[18px] font-medium text-gray-600 whitespace-nowrap">
            Most relevant
          </span>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </section>
  );
}
