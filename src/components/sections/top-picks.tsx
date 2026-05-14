import { DiscoverCard } from "@/components/ui/discover-card";
import { TOP_PICKS } from "@/lib/data";

export function TopPicks() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
          Top picks for you
        </h2>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
          {TOP_PICKS.map((card, idx) => (
            <DiscoverCard key={idx} {...card} className="min-w-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
