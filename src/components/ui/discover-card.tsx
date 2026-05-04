import { Users, Globe, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiscoverCardProps {
  image: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  description?: string;
  members: string;
  type: "Community" | "Course";
  pricing: "Free" | string;
  className?: string;
}

export function DiscoverCard({
  image,
  title,
  creator,
  creatorAvatar,
  description = "Use this space to track your progress, reflect on your growth, and connect with fellow students who are mastering the same core tools.",
  members,
  type,
  pricing,
  className,
}: DiscoverCardProps) {
  const TypeIcon = type === "Course" ? GraduationCap : Globe;

  return (
    <div
      className={cn(
        // bg-white, border-gray-200, radius 16, shadow xs, flex-col gap-3 (12px), overflow clip
        // Hover: border becomes Primary 200 #B2CCFF, image zooms gently
        "flex flex-col gap-3 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden cursor-pointer group transition-colors duration-200 hover:border-primary200",
        className,
      )}
    >
      {/* Thumb — aspect 343/192, p-3, image absolute, free/paid tag in top-right */}
      <div className="relative w-full aspect-[343/192] p-3 flex flex-col items-end justify-between overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* Free / Paid tag — backdrop blur, white/75, rounded 12, h-24, px-8, 13px medium gray-700 */}
        <div className="relative z-10 backdrop-blur-[2px] bg-white/75 rounded-xl h-6 max-h-6 min-h-6 px-2 flex items-center justify-center">
          <span className="text-[13px] leading-[18px] font-medium text-gray-700">
            {pricing}
          </span>
        </div>
      </div>

      {/* Text and supporting text — px-4 pb-4, content gap-3 (12px) */}
      <div className="flex items-center gap-2 px-4 pb-4 w-full">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Title block: gap-2 (8px) */}
          <div className="flex flex-col gap-2 w-full">
            {/* Title + creator: gap-0.5 (2px) */}
            <div className="flex flex-col gap-0.5 w-full">
              {/* Title: 16px Semi Bold, line-24, gray-900, truncate */}
              <h3 className="text-[16px] leading-6 font-semibold text-gray-900 truncate w-full">
                {title}
              </h3>
              {/* Creator: avatar 16px + 11px Regular gray-500 line-16 */}
              <div className="flex items-center gap-1">
                <img
                  src={creatorAvatar}
                  alt={creator}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span className="text-[11px] leading-4 text-gray-500 truncate">
                  By {creator}
                </span>
              </div>
            </div>
            {/* Description: 13px Regular gray-600 line-18, truncate */}
            <p className="text-[13px] leading-[18px] text-gray-600 truncate w-full">
              {description}
            </p>
          </div>

          {/* Horizontal divider */}
          <div className="h-px w-full bg-gray-200" />

          {/* Bottom row: members • type, 13px gray-500 line-18, gap-3 (12px) */}
          <div className="flex items-center gap-3 w-full">
            {/* Members */}
            <div className="flex items-center gap-1">
              <Users size={14} strokeWidth={1.67} className="text-gray-500 shrink-0" />
              <span className="text-[13px] leading-[18px] text-gray-500">
                {members}
              </span>
            </div>
            {/* Bullet separator (5px circle) */}
            <span className="block w-[5px] h-[5px] rounded-full bg-gray-300 shrink-0" />
            {/* Type (no pill, just icon + text) */}
            <div className="flex items-center gap-1">
              <TypeIcon size={14} strokeWidth={1.67} className="text-gray-500 shrink-0" />
              <span className="text-[13px] leading-[18px] text-gray-500">
                {type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
