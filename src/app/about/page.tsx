import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/shared/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about ASAT Technologies — integrated technology products, business systems, IT infrastructure and professional consulting.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About ASAT Technologies"
        description="Integrated Technology. Intelligent Business."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <section className="bg-white py-14 md:py-16">
        <Container className="max-w-3xl">
          <div className="mb-4 h-0.5 w-10 bg-accent-cyan" />
          <h2 className="text-3xl font-bold text-primary-text">
            Technology and expertise working together.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-secondary-text">
            <p>
              ASAT Technologies brings together technology hardware, enterprise
              business systems, IT infrastructure and professional consulting to
              help organizations operate with greater clarity and confidence.
            </p>
            <p>
              From point-of-sale environments and business technology products to
              Microsoft Dynamics 365 Business Central explorations, cybersecurity
              and advisory services, our approach is practical, enquiry-driven
              and focused on sustainable business outcomes.
            </p>
            <p>
              We do not claim unverified partnerships, awards or customer
              statistics. Every engagement starts with understanding your
              requirements and recommending solutions that fit.
            </p>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
