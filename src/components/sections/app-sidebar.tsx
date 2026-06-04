"use client";

import { Layers, Palette, Plus, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Left icon rail for the logged-in shell — Figma node 2942:30536 ("Left Side
// Nav"): 52px wide, white, 1px right border (#eaecf0), full height. A Kollab
// mark sits in a 60px slot up top, four 48px icon tabs follow (each separated
// by a hairline divider), then a flexible spacer pushes an "add" tab to the
// bottom. Hidden below lg (the rail is a desktop affordance).

const NAV_ICONS = [
  { icon: Sparkles, label: "For you", active: true },
  { icon: Users, label: "Communities", active: false },
  { icon: Layers, label: "Courses", active: false },
  { icon: Palette, label: "Creators", active: false },
];

function RailDivider() {
  return <div className="h-px w-full bg-gray-200" />;
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[52px] shrink-0 flex-col items-stretch self-start border-r border-gray-200 bg-white lg:flex">
      {/* Brand mark */}
      <div className="flex h-[60px] items-center justify-center">
        <img
          src="/kollab-mark.png"
          alt="Kollab"
          width={48}
          height={48}
          className="size-6 select-none object-contain"
          draggable={false}
        />
      </div>
      <RailDivider />

      {NAV_ICONS.map(({ icon: Icon, label, active }, index) => (
        <div key={label} className="flex flex-col">
          <button
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-12 items-center justify-center transition-colors",
              active
                ? "text-indigo-600"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            <Icon size={24} strokeWidth={1.85} />
          </button>
          {index < NAV_ICONS.length - 1 ? <RailDivider /> : null}
        </div>
      ))}

      <div className="flex-1" />
      <RailDivider />
      <button
        type="button"
        aria-label="Create"
        className="flex h-12 items-center justify-center text-gray-400 transition-colors hover:text-gray-700"
      >
        <span className="flex size-6 items-center justify-center rounded-[5px] border-[1.75px] border-current">
          <Plus size={14} strokeWidth={2.5} />
        </span>
      </button>
    </aside>
  );
}
