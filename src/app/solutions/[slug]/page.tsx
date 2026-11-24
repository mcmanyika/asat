import { notFound } from "next/navigation";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { JsonLd } from "@/components/shared/JsonLd";
import { getSolutionBySlug, solutions } from "@/data/solutions";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};
  return buildMetadata({
    title: solution.name,
    description: solution.shortDescription,
    path: solution.href,
    image: solution.image,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: solution.name,
          description: solution.shortDescription,
          url: solution.href,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "IT Solutions", path: "/solutions" },
          { name: solution.name, path: solution.href },
        ])}
      />
      <ContentDetail
        item={solution}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "IT Solutions", href: "/solutions" },
          { label: solution.name },
        ]}
        primaryCta={{
          href: `/request-quote?interest=it-solutions&subject=${encodeURIComponent(solution.name)}`,
          label: "Request a Quote",
        }}
      />
    </>
  );
}
