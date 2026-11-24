import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { BreadcrumbItem } from "@/types";

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHero({ title, description, breadcrumbs }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-navy text-white">
      <Container className="py-12 md:py-16">
        {breadcrumbs ? (
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-6 [&_span]:text-slate-300 [&_a]:text-slate-300 [&_a:hover]:text-white [&_[aria-current=page]]:text-white"
          />
        ) : null}
        <div className="mb-4 h-0.5 w-10 bg-accent-cyan" />
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
