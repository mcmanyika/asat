import { Container } from "@/components/shared/Container";

export function CompanyIntroduction() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-0">
          <div className="md:pr-12 lg:pr-16">
            <div className="mb-4 h-0.5 w-10 bg-accent-cyan" />
            <h2 className="text-3xl font-bold tracking-tight text-primary-text text-balance sm:text-4xl">
              Technology. Expertise.
              <br />
              Business Transformation.
            </h2>
          </div>
          <div className="md:border-l md:border-border md:pl-12 lg:pl-16">
            <p className="text-base leading-relaxed text-secondary-text sm:text-lg">
              At ASAT Technologies, we bring together technology and business
              expertise to address the evolving needs of modern organizations.
              From enterprise resource planning and industry-specific
              point-of-sale systems to reliable hardware, cybersecurity and
              business consulting, we provide integrated solutions that help
              businesses move forward with confidence.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
