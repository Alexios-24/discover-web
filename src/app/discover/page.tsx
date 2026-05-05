import { TopHeader } from "@/components/sections/top-header";
import { DiscoverHero } from "@/components/sections/hero";
import { DiscoverContent } from "@/components/sections/discover-content";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <TopHeader />
      <div className="max-w-[1440px] mx-auto">
        <DiscoverHero />
      </div>
      <div className="max-w-[1440px] mx-auto">
        <DiscoverContent />
      </div>
    </main>
  );
}
