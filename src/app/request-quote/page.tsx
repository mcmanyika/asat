import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { EnquiryFormLoader } from "@/components/forms/EnquiryFormLoader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Quote",
  description:
    "Request a quote from ASAT Technologies for technology products, systems or IT solutions.",
  path: "/request-quote",
});

export default function RequestQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; subject?: string }>;
}) {
  return (
    <>
      <PageHero
        title="Request a Quote"
        description="Tell us about the products or solutions you need."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Request a Quote" },
        ]}
      />
      <section className="bg-light-bg py-14 md:py-16">
        <Container className="max-w-3xl">
          <EnquiryFormLoader
            type="quote"
            searchParams={searchParams}
            fallbackInterest="products"
          />
        </Container>
      </section>
    </>
  );
}
