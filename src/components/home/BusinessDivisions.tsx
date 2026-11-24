import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Laptop,
  MonitorCog,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const divisions = [
  {
    title: "ASAT Products",
    description:
      "Reliable business technology products to keep your organization productive and efficient.",
    href: "/products",
    linkLabel: "Explore Products",
    image: "/images/divisions/products-photo.png",
    imageAlt: "Business laptop technology product",
    icon: Laptop,
  },
  {
    title: "ASAT Business Systems",
    description:
      "Industry-focused business systems including Microsoft Dynamics 365 Business Central and specialized POS solutions.",
    href: "/systems",
    linkLabel: "Explore Business Systems",
    image: "/images/divisions/business-systems-photo.png",
    imageAlt: "Point-of-sale terminal for business systems",
    icon: MonitorCog,
  },
  {
    title: "ASAT IT Solutions",
    description:
      "Secure, reliable and scalable IT infrastructure including antivirus, firewalls and networking solutions.",
    href: "/solutions",
    linkLabel: "Explore IT Solutions",
    image: "/images/divisions/it-solutions-photo.png",
    imageAlt: "Server rack and IT infrastructure",
    icon: ShieldCheck,
  },
  {
    title: "ASAT Consulting",
    description:
      "Expert consulting services in retail operations, security analysis and business analytics.",
    href: "/consulting",
    linkLabel: "Explore Consulting",
    image: "/images/divisions/consulting-photo.png",
    imageAlt: "Business technology consulting environment",
    icon: ChartNoAxesCombined,
  },
] as const;

export function BusinessDivisions() {
  return (
    <section id="solutions" className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Core Business Divisions"
          description="Integrated technology capabilities designed to support every stage of your business operations."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {divisions.map((division) => {
            const Icon = division.icon;
            return (
              <article
                key={division.href}
                className="group flex h-full flex-col border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={division.image}
                    alt={division.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="relative flex flex-1 flex-col px-5 pt-8 pb-6">
                  <div className="absolute -top-6 left-5 flex size-12 items-center justify-center border border-border bg-white text-corporate-blue shadow-sm">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-primary-text">
                    {division.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary-text">
                    {division.description}
                  </p>
                  <Link
                    href={division.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue transition-colors hover:text-gold-dark"
                  >
                    {division.linkLabel}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
