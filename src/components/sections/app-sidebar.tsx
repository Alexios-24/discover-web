"use client";

import {
  AddBoxIcon,
  ColorsIcon,
  GraduationFilledIcon,
  StarIcon,
  UsersFilledIcon,
} from "@/components/icons/ghl-icons";

// Left icon rail for the signed-in shell — Figma node 2942:28627 ("Left Side
// Nav"): 52px wide, white, 1px right border (#eaecf0), full height. A Kollab
// mark sits in a 60px slot up top, four 48px icon tabs follow (each separated
// by a hairline divider), then a flexible spacer pushes an "add" tab to the
// bottom. Hidden below lg (desktop-only affordance).

function RailDivider() {
  return <div className="h-px w-full bg-[#eaecf0]" />;
}

const NAV_ITEMS = [
  { Icon: StarIcon, label: "Discover" },
  { Icon: UsersFilledIcon, label: "Communities" },
  { Icon: GraduationFilledIcon, label: "Courses" },
  { Icon: ColorsIcon, label: "Creators" },
] as const;

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[52px] shrink-0 flex-col items-stretch self-start border-r border-[#eaecf0] bg-white lg:flex">
      {/* Kollab mark — 60px slot, centered */}
      <div className="flex h-[60px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px]">
        <img
          src="/kollab-mark.png"
          alt="Kollab"
          width={24}
          height={24}
          className="size-6 select-none object-contain"
          draggable={false}
        />
      </div>
      <RailDivider />

      {/* Main nav tabs — four 48px icon slots */}
      {NAV_ITEMS.map(({ Icon, label }, i) => (
        <div key={label} className="flex flex-col">
          <button
            type="button"
            aria-label={label}
            className="flex h-12 items-center justify-center rounded-bl-[4px] rounded-tl-[4px] text-[#343DE5] transition-colors hover:bg-indigo-50"
          >
            <Icon size={24} />
          </button>
          {i < NAV_ITEMS.length - 1 && <RailDivider />}
        </div>
      ))}

      {/* Spacer pushes create tab to bottom */}
      <div className="flex-1" />

      {/* Create / add tab — divider at top, 48px button below */}
      <RailDivider />
      <button
        type="button"
        aria-label="Create"
        className="flex h-12 items-center justify-center rounded-bl-[4px] rounded-tl-[4px] text-[#343DE5] transition-colors hover:bg-indigo-50"
      >
        <AddBoxIcon size={24} />
      </button>
    </aside>
  );
}
