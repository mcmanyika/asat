import { CatalogPage } from "@/components/shared/CatalogPage";
import { getSystems } from "@/lib/content/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Business Systems",
  description:
    "Microsoft Dynamics 365 Business Central, retail, pharmacy and restaurant POS, plus electronic shelf label solutions.",
  path: "/systems",
});

export default function SystemsPage() {
  return (
    <CatalogPage
      title="Business Systems"
      description="Enterprise ERP, industry POS linked to Business Central, and electronic label solutions for modern retail."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Business Systems" },
      ]}
      loadItems={getSystems}
    />
  );
}
