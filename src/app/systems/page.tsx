import { CatalogGrid } from "@/components/shared/CatalogGrid";
import { systems } from "@/data/systems";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Business Systems",
  description:
    "Enterprise business systems including Microsoft Dynamics 365 Business Central and industry-focused POS solutions.",
  path: "/systems",
});

export default function SystemsPage() {
  return (
    <CatalogGrid
      title="Business Systems"
      description="Integrated enterprise management and industry-specific point-of-sale solutions."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Business Systems" },
      ]}
      items={systems}
    />
  );
}
