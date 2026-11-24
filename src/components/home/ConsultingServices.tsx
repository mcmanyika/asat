import {
  ChartNoAxesCombined,
  ShieldAlert,
  Store,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";

const services = [
  {
    title: "Retail Consulting",
    description:
      "Advisory support to align retail technology, operations and growth priorities.",
    href: "/consulting/retail-consulting",
    icon: Store,
  },
  {
    title: "Security Analysis",
    description:
      "Structured assessment to strengthen security awareness and infrastructure resilience.",
    href: "/consulting/security-analysis",
    icon: ShieldAlert,
  },
  {
    title: "Business Analytics",
    description:
      "Insight-focused consulting to improve visibility into performance and operations.",
    href: "/consulting/business-analytics",
    icon: ChartNoAxesCombined,
  },
] as const;

export function ConsultingServices() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Expertise That Drives Business Performance."
          description="Professional consulting services designed to help organizations make confident technology and operational decisions."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/request-consultation">
            Request a Consultation
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
