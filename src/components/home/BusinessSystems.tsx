import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { systems } from "@/data/systems";

export function BusinessSystems() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Intelligent Systems. Smarter Operations."
          description="Transform your business operations with integrated enterprise management and industry-specific point-of-sale solutions."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {systems.map((system) => (
            <article
              key={system.slug}
              className="overflow-hidden border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-21/9">
                <Image
                  src={system.image}
                  alt={system.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-text">
                  {system.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary-text">
                  {system.shortDescription}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={system.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue hover:text-gold-dark"
                  >
                    Learn More
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <ButtonLink
                    href={`/request-demo?interest=business-systems&subject=${encodeURIComponent(system.name)}`}
                    variant="outline"
                    size="sm"
                  >
                    Request a Demo
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
