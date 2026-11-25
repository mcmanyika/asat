import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CompanyIntroduction } from "@/components/home/CompanyIntroduction";
import { BusinessDivisions } from "@/components/home/BusinessDivisions";
import { HomeProductCategories } from "@/components/home/HomeProductCategories";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getLandingSectionsVisibility } from "@/lib/content/landing-sections";

async function HomePageSectionsInner() {
  const sections = await getLandingSectionsVisibility();

  return (
    <>
      {sections.hero ? <HeroSection /> : null}
      {sections.companyIntroduction ? <CompanyIntroduction /> : null}
      {sections.businessDivisions ? <BusinessDivisions /> : null}
      {sections.productCategories ? <HomeProductCategories /> : null}
      {sections.finalCta ? <FinalCTA /> : null}
    </>
  );
}

export function HomePageSections() {
  return (
    <Suspense
      fallback={
        <>
          <HeroSection />
          <CompanyIntroduction />
          <BusinessDivisions />
          <HomeProductCategories />
          <FinalCTA />
        </>
      }
    >
      <HomePageSectionsInner />
    </Suspense>
  );
}
