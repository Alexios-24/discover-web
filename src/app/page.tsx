"use client";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { VideoShowcase } from "@/components/landing/video-showcase";
import { CategoryShowcase } from "@/components/landing/category-showcase";
import { TrendingSection } from "@/components/landing/trending-section";
import { TopPicksSection } from "@/components/landing/top-picks-section";
import { CreatorsSection } from "@/components/landing/creators-section";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { BrowseAllSection } from "@/components/landing/browse-all-section";
import { LiveFeed } from "@/components/landing/live-feed";
import { DualSection } from "@/components/landing/dual-section";
import { FeaturedSection } from "@/components/landing/featured-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import { StatsSection } from "@/components/landing/stats-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { ParticleCanvas } from "@/components/landing/particle-canvas";
import {
  VariantProvider,
  VariantSwitcher,
  useVariant,
} from "@/components/landing/variant-switcher";

function HeroSwitch() {
  const { variant } = useVariant();

  if (variant === "v2") {
    return (
      <section id="landing-hero" className="relative h-screen flex items-center justify-center bg-[#030305] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleCanvas className="absolute inset-0" />
        </div>
        <p className="relative z-10 text-white/30 text-sm font-medium tracking-wide">
          V2 hero — coming soon
        </p>
      </section>
    );
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
        <FeaturedSection />
        <DualSection />
        <LiveFeed />
        <BentoGrid />
        <StatsSection />
        <FinalCTA />
        <LandingFooter />
        <VariantSwitcher />
      </main>
    </VariantProvider>
  );
}
