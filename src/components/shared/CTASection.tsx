import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";

type CTASectionProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTASection({
  title = "Ready to Transform Your Business?",
  description = "Discover the right technology, systems and solutions to support your business objectives.",
  primaryHref = "/request-consultation",
  primaryLabel = "Request a Consultation",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: CTASectionProps) {
  return (
    <section className="geometric-cta">
      <Container className="py-14 text-center md:py-16">
        <div className="mx-auto mb-4 h-0.5 w-10 bg-accent-cyan" />
        <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={primaryHref} variant="primary" size="lg">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="secondary" size="lg">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
