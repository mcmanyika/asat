import { CatalogPage } from "@/components/shared/CatalogPage";
import { getIndustries } from "@/lib/content/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industries",
  description:
    "Technology solutions for retail, pharmacies, restaurants and hospitality, and corporate businesses.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <CatalogPage
      title="Industries"
      description="Technology solutions aligned to the operational needs of your industry."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Industries" },
      ]}
      loadItems={getIndustries}
    />
  );
}
