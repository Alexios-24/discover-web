"use client";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHeroV2 } from "@/components/landing/landing-hero-v2";
import { CategoryShowcase } from "@/components/landing/category-showcase";
import { TrendingSection } from "@/components/landing/trending-section";
import { TopPicksSection } from "@/components/landing/top-picks-section";
import { CreatorsSection } from "@/components/landing/creators-section";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { RisingCreatorsSection } from "@/components/landing/rising-creators-section";
import { BrowseAllSection } from "@/components/landing/browse-all-section";
import { NumbersSection } from "@/components/landing/numbers-section";
import { LandingFooter } from "@/components/landing/footer";
import {
  VariantProvider,
  VariantSwitcher,
  useVariant,
} from "@/components/landing/variant-switcher";

function HeroSwitch() {
  const { variant } = useVariant();

  // Swapped: V1 shows the V2 hero, V2 shows the V1 hero.
  if (variant === "v2") {
    return <LandingHero />;
  }

  return <LandingHeroV2 />;
}

// The lower "Featured products" mosaic is hidden in V1 (only the top
// "Featured products" carousel remains); V2 keeps it.
function FeaturedProductsSwitch() {
  const { variant } = useVariant();

  if (variant === "v1") {
    return null;
  }

  return <FeaturedProducts />;
}

export default function LandingPage() {
  return (
    <VariantProvider>
      <main className="min-h-screen w-full font-sans bg-ink text-cream overflow-clip">
        <LandingNav />
        <HeroSwitch />
        <CategoryShowcase />
        <TrendingSection />
        <TopPicksSection />
        <CreatorsSection />
        <FeaturedProductsSwitch />
        <BrowseAllSection />
        <RisingCreatorsSection />
        <NumbersSection />
        <LandingFooter />
        <VariantSwitcher />
      </main>
    </VariantProvider>
  );
}
