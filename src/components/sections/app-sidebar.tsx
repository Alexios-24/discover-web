"use client";

import {
  ColorsIcon,
  GraduationFilledIcon,
  StarIcon,
  UsersFilledIcon,
} from "@/components/icons/ghl-icons";

// Left icon rail for the signed-in shell — Figma node 2720:41283 ("Left Side
// Nav"): 52px wide, white, 1px right border (#eaecf0), full height. A Kollab
// mark sits in a 60px slot up top, two 48px icon tabs, a 48px profile tab,
// then two more 48px icon tabs. Hidden below lg (desktop-only affordance).

function RailDivider() {
  return <div className="h-px w-full bg-[#eaecf0]" />;
}

const NAV_ITEMS = [
  { Icon: StarIcon, label: "Discover" },
  { Icon: UsersFilledIcon, label: "Communities" },
  { Icon: GraduationFilledIcon, label: "Courses" },
  { Icon: ColorsIcon, label: "Creators" },
] as const;

// Stable demo avatar (matches the logged-in profile portrait used in the app header).
const SIDEBAR_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop&q=60";

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

      {/* Discover + Communities */}
      {NAV_ITEMS.slice(0, 2).map(({ Icon, label }, i) => (
        <div key={label} className="flex flex-col">
          <button
            type="button"
            aria-label={label}
            className="flex h-12 items-center justify-center rounded-bl-[4px] rounded-tl-[4px] text-[#343DE5] transition-colors hover:bg-indigo-50"
          >
            <Icon size={24} />
          </button>
          {i === 0 && <RailDivider />}
        </div>
      ))}

      {/* Profile avatar tab */}
      <button
        type="button"
        aria-label="Profile"
        className="flex h-12 items-center justify-center rounded-bl-[4px] rounded-tl-[4px] transition-colors hover:bg-indigo-50"
      >
        <span className="block size-6 overflow-hidden rounded-full border border-[#eaecf0]">
          <img
            src={SIDEBAR_AVATAR}
            alt=""
            width={48}
            height={48}
            className="size-full object-cover"
            draggable={false}
          />
        </span>
      </button>
      <RailDivider />

      {/* Courses + Creators */}
      {NAV_ITEMS.slice(2).map(({ Icon, label }, i) => (
        <div key={label} className="flex flex-col">
          <button
            type="button"
            aria-label={label}
            className="flex h-12 items-center justify-center rounded-bl-[4px] rounded-tl-[4px] text-[#343DE5] transition-colors hover:bg-indigo-50"
          >
            <Icon size={24} />
          </button>
          {i === 0 && <RailDivider />}
        </div>
      ))}

      {/* Spacer fills the remaining rail; bottom create tab removed per Figma. */}
      <div className="flex-1" />
    </aside>
  );
}
