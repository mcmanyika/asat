import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { DetailPageFallback } from "@/components/shared/DetailPageFallback";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/shared/CTASection";
import { JsonLd } from "@/components/shared/JsonLd";
import { getIndustryBySlug, industries } from "@/data/industries";
import { products } from "@/data/products";
import { systems } from "@/data/systems";
import { solutions } from "@/data/solutions";
import { consultingServices } from "@/data/consulting";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return buildMetadata({
    title: industry.name,
    description: industry.shortDescription,
    path: industry.href,
    image: industry.image,
  });
}

async function IndustryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const related = [
    {
      title: "Related Products",
      items: products.filter((item) =>
        industry.relatedProducts.includes(item.slug),
      ),
    },
    {
      title: "Business Systems",
      items: systems.filter((item) =>
        industry.relatedSystems.includes(item.slug),
      ),
    },
    {
      title: "IT Solutions",
      items: solutions.filter((item) =>
        industry.relatedSolutions.includes(item.slug),
      ),
    },
    {
      title: "Consulting",
      items: consultingServices.filter((item) =>
        industry.relatedConsulting.includes(item.slug),
      ),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: industry.name,
          description: industry.shortDescription,
          url: industry.href,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: industry.href },
        ])}
      />
      <PageHero
        title={industry.name}
        description={industry.shortDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: industry.name },
        ]}
      />
      <section className="bg-white py-14 md:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="relative aspect-4/3 overflow-hidden border border-border">
              <Image
                src={industry.image}
                alt={industry.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-base leading-relaxed text-secondary-text sm:text-lg">
                {industry.description}
              </p>
            </div>
          </div>

          <div className="mt-14 space-y-10">
            {related.map((group) => (
              <div key={group.title}>
                <h2 className="mb-5 text-2xl font-bold text-primary-text">
                  {group.title}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className="border border-border bg-light-bg p-5 transition hover:border-corporate-blue"
                    >
                      <h3 className="font-semibold text-primary-text">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm text-secondary-text">
                        {item.shortDescription}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-corporate-blue">
                        Learn More
                        <ArrowRight className="size-4" aria-hidden />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}

export default function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<DetailPageFallback />}>
      <IndustryDetail params={params} />
    </Suspense>
  );
}
