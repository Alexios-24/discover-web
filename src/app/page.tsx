"use client";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHeroV2 } from "@/components/landing/landing-hero-v2";
import { VideoShowcase } from "@/components/landing/video-showcase";
import { CategoryShowcase } from "@/components/landing/category-showcase";
import { TrendingSection } from "@/components/landing/trending-section";
import { TopPicksSection } from "@/components/landing/top-picks-section";
import { CreatorsSection } from "@/components/landing/creators-section";
import { FeaturedProducts } from "@/components/landing/featured-products";
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

  if (variant === "v2") {
    return <LandingHeroV2 />;
  }

  return <LandingHero />;
}

export default function LandingPage() {
  return (
    <VariantProvider>
      <main className="min-h-screen w-full font-sans bg-ink text-cream overflow-clip">
        <LandingNav />
        <HeroSwitch />
        <VideoShowcase />
        <CategoryShowcase />
        <TrendingSection />
        <TopPicksSection />
        <CreatorsSection />
        <FeaturedProducts />
        <BrowseAllSection />
        <NumbersSection />
        <LandingFooter />
        <VariantSwitcher />
      </main>
    </VariantProvider>
  );
}
