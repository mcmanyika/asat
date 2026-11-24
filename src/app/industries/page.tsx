import { CatalogGrid } from "@/components/shared/CatalogGrid";
import { industries } from "@/data/industries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industries",
  description:
    "Technology solutions for retail, pharmacies, restaurants and hospitality, and corporate businesses.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <CatalogGrid
      title="Industries"
      description="Technology solutions aligned to the operational needs of your industry."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Industries" },
      ]}
      items={industries}
    />
  );
}
