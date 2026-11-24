import { HeroSection } from "@/components/home/HeroSection";
import { CompanyIntroduction } from "@/components/home/CompanyIntroduction";
import { BusinessDivisions } from "@/components/home/BusinessDivisions";
import { ProductCategories } from "@/components/home/ProductCategories";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyIntroduction />
      <BusinessDivisions />
      <ProductCategories />
      <FinalCTA />
    </>
  );
}
