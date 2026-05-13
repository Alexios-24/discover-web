import { DiscoverCard } from "@/components/ui/discover-card";
import { TRENDING } from "@/lib/data";

export function TrendingNow() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <h2 className="font-montserrat text-[18px] leading-normal font-semibold text-gray-900">
          Trending now
        </h2>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
          {TRENDING.map((card, idx) => (
            <DiscoverCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
