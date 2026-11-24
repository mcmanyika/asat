import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { JsonLd } from "@/components/shared/JsonLd";
import { getProductBySlug, products } from "@/data/products";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: product.href,
    image: product.image,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: product.name,
          description: product.shortDescription,
          url: product.href,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: product.href },
        ])}
      />
      <ContentDetail
        item={product}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
        primaryCta={{
          href: `/request-quote?interest=products&subject=${encodeURIComponent(product.name)}`,
          label: "Request a Quote",
        }}
        imageFit="contain"
      />
    </>
  );
}
