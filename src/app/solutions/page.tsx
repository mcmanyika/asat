import { CatalogGrid } from "@/components/shared/CatalogGrid";
import { solutions } from "@/data/solutions";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "IT Solutions",
  description:
    "IT infrastructure and security solutions including antivirus, firewalls and networking.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <CatalogGrid
      title="IT Solutions"
      description="Secure, reliable and scalable IT infrastructure for modern organizations."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "IT Solutions" },
      ]}
      items={solutions}
    />
  );
}
