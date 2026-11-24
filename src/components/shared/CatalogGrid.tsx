import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/shared/CTASection";
import type { BreadcrumbItem, ContentItem } from "@/types";

type CatalogGridProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  items: ContentItem[];
  imageFit?: "cover" | "contain";
};

export function CatalogGrid({
  title,
  description,
  breadcrumbs,
  items,
  imageFit = "cover",
}: CatalogGridProps) {
  return (
    <>
      <PageHero
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <section className="bg-light-bg py-14 md:py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group flex h-full flex-col overflow-hidden border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`relative ${
                    imageFit === "contain"
                      ? "aspect-square bg-white p-6"
                      : "aspect-16/10"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className={
                      imageFit === "contain" ? "object-contain p-6" : "object-cover"
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-primary-text group-hover:text-corporate-blue">
                    {item.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary-text">
                    {item.shortDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue">
                    Learn More
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
