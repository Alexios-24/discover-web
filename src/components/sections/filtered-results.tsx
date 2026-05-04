import { DiscoverCard } from "@/components/ui/discover-card";
import { BROWSE_PRODUCTS } from "@/lib/data";

export function FilteredResults() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {BROWSE_PRODUCTS.map((card, idx) => (
        <DiscoverCard key={idx} {...card} />
      ))}
    </div>
  );
}
