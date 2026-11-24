import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { industries } from "@/data/industries";

export function IndustriesSection() {
  return (
    <section className="bg-light-bg py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Technology Solutions for Your Industry."
          description="Explore solutions tailored to the operational needs of key industry environments."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={industry.href}
              className="group overflow-hidden border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-16/10">
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary-text group-hover:text-corporate-blue">
                  {industry.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary-text">
                  {industry.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue">
                  Explore Industry
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
