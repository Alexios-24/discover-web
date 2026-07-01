import { DiscoverCard } from "@/components/ui/discover-card";
import { BROWSE_PRODUCTS } from "@/lib/data";
import type { FilterState } from "./filters-panel";

const PRODUCT_CATEGORY_BY_TITLE: Record<string, string> = {
  "Churned users psychology": "Leadership",
  "F1 enthusiasts": "Miscellaneous",
  "Podcasting fundamentals": "Productivity",
  "Interior designers": "Creative",
  "Red dead redemption": "Miscellaneous",
  "Procreate masters": "Creative",
  "How to read books effectively": "Productivity",
  "VR enthusiasts": "Technology",
  "Tourists forever": "Miscellaneous",
  "UX research mastery": "Marketing",
  "Retro gaming collective": "Miscellaneous",
  "Startup founders hub": "Entrepreneurship",
  "Full-stack development": "Technology",
  "Music producers unite": "Creative",
  "Digital illustration 101": "Creative",
  "Fitness & wellness tribe": "Wellness",
};

export function FilteredResults({ filters }: { filters: FilterState }) {
  const products =
    filters.categories.length > 0
      ? BROWSE_PRODUCTS.filter((product) =>
          filters.categories.includes(PRODUCT_CATEGORY_BY_TITLE[product.title] ?? ""),
        )
      : BROWSE_PRODUCTS;

  return (
    <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-4">
      {products.map((card, idx) => (
        <DiscoverCard key={idx} {...card} />
      ))}
    </div>
  );
}
