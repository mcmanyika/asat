import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms of Use for the ${siteConfig.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        description="Terms governing use of the ASAT Technologies website."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Use" },
        ]}
      />
      <section className="bg-white py-14 md:py-16">
        <Container className="max-w-3xl space-y-5 text-secondary-text">
          <p>
            By accessing this website, you agree to use it for lawful
            informational and enquiry purposes only. These terms will be
            finalized with legal counsel before public launch.
          </p>
          <h2 className="text-xl font-bold text-primary-text">Website content</h2>
          <p>
            Content on this website is provided for general information. Product
            availability, system capabilities and service scope are confirmed
            during direct engagement and may change without notice.
          </p>
          <h2 className="text-xl font-bold text-primary-text">No e-commerce</h2>
          <p>
            This website does not provide online purchasing, payments or
            customer account registration. All commercial arrangements are
            handled through direct enquiry.
          </p>
          <h2 className="text-xl font-bold text-primary-text">Limitation</h2>
          <p>
            {siteConfig.name} is not liable for decisions made solely on the
            basis of general website content. Formal proposals and agreements
            govern any commercial relationship.
          </p>
        </Container>
      </section>
    </>
  );
}
