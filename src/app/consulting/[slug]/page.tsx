import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { DetailPageFallback } from "@/components/shared/DetailPageFallback";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  getConsultingBySlug,
  getConsultingServices,
} from "@/lib/content/queries";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const consultingServices = await getConsultingServices();
  return consultingServices.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getConsultingBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.name,
    description: item.shortDescription,
    path: item.href,
    image: item.image,
  });
}

async function ConsultingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getConsultingBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: item.name,
          description: item.shortDescription,
          url: item.href,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Consulting", path: "/consulting" },
          { name: item.name, path: item.href },
        ])}
      />
      <ContentDetail
        item={item}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Consulting", href: "/consulting" },
          { label: item.name },
        ]}
        primaryCta={{
          href: `/request-consultation?interest=consulting&subject=${encodeURIComponent(item.name)}`,
          label: "Request a Consultation",
        }}
      />
    </>
  );
}

export default function ConsultingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageFallback />}>
      <ConsultingDetail params={params} />
    </Suspense>
  );
}
