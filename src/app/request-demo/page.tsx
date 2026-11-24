import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { EnquiryFormLoader } from "@/components/forms/EnquiryFormLoader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Demo",
  description:
    "Request a software demo for ASAT Technologies business systems and POS solutions.",
  path: "/request-demo",
});

export default function RequestDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; subject?: string }>;
}) {
  return (
    <>
      <PageHero
        title="Request a Demo"
        description="Arrange a demonstration of the business system you are evaluating."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Request a Demo" },
        ]}
      />
      <section className="bg-light-bg py-14 md:py-16">
        <Container className="max-w-3xl">
          <EnquiryFormLoader
            type="demo"
            searchParams={searchParams}
            fallbackInterest="business-systems"
          />
        </Container>
      </section>
    </>
  );
}
