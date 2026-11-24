import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { EnquiryFormLoader } from "@/components/forms/EnquiryFormLoader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Consultation",
  description:
    "Request a consultation with ASAT Technologies on retail operations, security analysis or business analytics.",
  path: "/request-consultation",
});

export default function RequestConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; subject?: string }>;
}) {
  return (
    <>
      <PageHero
        title="Request a Consultation"
        description="Discuss technology and business priorities with our consulting team."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Request a Consultation" },
        ]}
      />
      <section className="bg-light-bg py-14 md:py-16">
        <Container className="max-w-3xl">
          <EnquiryFormLoader
            type="consultation"
            searchParams={searchParams}
            fallbackInterest="consulting"
          />
        </Container>
      </section>
    </>
  );
}
