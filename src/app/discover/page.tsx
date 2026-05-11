import { Suspense } from "react";
import { TopHeader } from "@/components/sections/top-header";
import { DiscoverHero } from "@/components/sections/hero";
import { DiscoverContent } from "@/components/sections/discover-content";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Suspense fallback={null}>
        <TopHeader />
      </Suspense>
      <div className="max-w-[1440px] mx-auto">
        <Suspense fallback={null}>
          <DiscoverHero />
        </Suspense>
      </div>
      <div className="max-w-[1440px] mx-auto">
        <Suspense fallback={null}>
          <DiscoverContent />
        </Suspense>
      </div>
    </main>
  );
}
