import { CatalogPage } from "@/components/shared/CatalogPage";
import { getConsultingServices } from "@/lib/content/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Consulting",
  description:
    "Professional consulting services in retail operations, security analysis and business analytics.",
  path: "/consulting",
});

export default function ConsultingPage() {
  return (
    <CatalogPage
      title="Consulting Services"
      description="Expert consulting to support retail operations, security analysis and business analytics."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Consulting" },
      ]}
      loadItems={getConsultingServices}
    />
  );
}
