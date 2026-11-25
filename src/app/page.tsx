import { HeroSection } from "@/components/home/HeroSection";
import { CompanyIntroduction } from "@/components/home/CompanyIntroduction";
import { BusinessDivisions } from "@/components/home/BusinessDivisions";
import { HomeProductCategories } from "@/components/home/HomeProductCategories";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyIntroduction />
      <BusinessDivisions />
      <HomeProductCategories />
      <FinalCTA />
    </>
  );
}
