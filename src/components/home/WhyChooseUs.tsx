import {
  Boxes,
  BriefcaseBusiness,
  Headset,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const reasons = [
  {
    title: "Integrated Technology Solutions",
    description:
      "Hardware, systems, infrastructure and consulting delivered as a connected offering.",
    icon: Boxes,
  },
  {
    title: "Business-Focused Approach",
    description:
      "Technology recommendations guided by operational needs and commercial outcomes.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Professional Expertise",
    description:
      "Experienced guidance across enterprise systems, POS, IT security and consulting.",
    icon: Users,
  },
  {
    title: "Scalable Business Systems",
    description:
      "Solutions designed to support growth across retail, pharmacy, hospitality and corporate environments.",
    icon: Layers3,
  },
  {
    title: "Security-Focused Infrastructure",
    description:
      "Connectivity and protection considered together so operations stay reliable and resilient.",
    icon: ShieldCheck,
  },
  {
    title: "Customer-Focused Service",
    description:
      "Enquiry-driven engagement focused on understanding requirements before recommending solutions.",
    icon: Headset,
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Why ASAT Technologies"
          description="A clear value proposition built around integrated technology and practical business support."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.title}
                className="border border-border bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex size-11 items-center justify-center bg-light-bg text-corporate-blue">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-primary-text">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary-text">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
