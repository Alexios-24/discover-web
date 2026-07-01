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
import { MobileAppSection } from "@/components/landing/mobile-app-section";
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

function LandingSectionsSwitch() {
  const { variant } = useVariant();

  if (variant === "v1") {
    return (
      <>
        <TrendingSection />
        <BrowseAllSection />
        <TopPicksSection />
        <CreatorsSection />
        <CategoryShowcase />
        <MobileAppSection />
      </>
    );
  }

  return (
    <>
      <TrendingSection />
      <CategoryShowcase />
      <TopPicksSection />
      <CreatorsSection />
      <FeaturedProducts />
      <BrowseAllSection />
      <RisingCreatorsSection />
      <MobileAppSection />
    </>
  );
}

export default function LandingPage() {
  return (
    <VariantProvider>
      <main className="min-h-screen w-full font-sans bg-ink text-cream overflow-clip">
        <LandingNav />
        <HeroSwitch />
        <LandingSectionsSwitch />
        <LandingFooter />
        <VariantSwitcher />
      </main>
    </VariantProvider>
  );
}
