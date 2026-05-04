import { DiscoverCard } from "@/components/ui/discover-card";
import { TOP_PICKS } from "@/lib/data";

export function TopPicks() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
          Top picks for you
        </h2>

        <div className="flex flex-wrap gap-6">
          {TOP_PICKS.map((card, idx) => (
            <DiscoverCard key={idx} {...card} className="flex-1 min-w-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
