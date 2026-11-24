import { CatalogGrid } from "@/components/shared/CatalogGrid";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Technology Products",
  description:
    "Business technology products including laptops, desktops, printers, POS machines, cash drawers and scanners.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <CatalogGrid
      title="Technology Products"
      description="A comprehensive range of business technology products for modern organizations."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products" },
      ]}
      items={products}
      imageFit="contain"
    />
  );
}
