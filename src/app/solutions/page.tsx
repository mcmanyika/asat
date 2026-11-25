import { CatalogPage } from "@/components/shared/CatalogPage";
import { getSolutions } from "@/lib/content/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "IT Solutions",
  description:
    "IT infrastructure and security solutions including antivirus, firewalls and networking.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <CatalogPage
      title="IT Solutions"
      description="Secure, reliable and scalable IT infrastructure for modern organizations."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "IT Solutions" },
      ]}
      loadItems={getSolutions}
    />
  );
}
