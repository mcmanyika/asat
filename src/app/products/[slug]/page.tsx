import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { DetailPageFallback } from "@/components/shared/DetailPageFallback";
import { JsonLd } from "@/components/shared/JsonLd";
import { getProductBySlug, getProducts } from "@/lib/content/queries";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: product.href,
    image: product.image,
  });
}

async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageFallback />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
