import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { DetailPageFallback } from "@/components/shared/DetailPageFallback";
import { JsonLd } from "@/components/shared/JsonLd";
import { getSystemBySlug, systems } from "@/data/systems";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return systems.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystemBySlug(slug);
  if (!system) return {};
  return buildMetadata({
    title: system.name,
    description: system.shortDescription,
    path: system.href,
    image: system.image,
  });
}

async function SystemDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystemBySlug(slug);
  if (!system) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: system.name,
          description: system.shortDescription,
          url: system.href,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Business Systems", path: "/systems" },
          { name: system.name, path: system.href },
        ])}
      />
      <ContentDetail
        item={system}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Systems", href: "/systems" },
          { label: system.name },
        ]}
        primaryCta={{
          href: `/request-demo?interest=business-systems&subject=${encodeURIComponent(system.name)}`,
          label: "Request a Demo",
        }}
        secondaryCta={{ href: "/contact", label: "Talk to an Expert" }}
      />
    </>
  );
}

export default function SystemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageFallback />}>
      <SystemDetail params={params} />
    </Suspense>
  );
}
