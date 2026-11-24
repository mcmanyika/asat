import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        description="How ASAT Technologies handles enquiry and website information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <section className="bg-white py-14 md:py-16">
        <Container className="prose-sm max-w-3xl space-y-5 text-secondary-text">
          <p>
            This Privacy Policy explains how {siteConfig.name} may collect and
            use information submitted through this website. The policy will be
            finalized with legal counsel before public launch.
          </p>
          <h2 className="text-xl font-bold text-primary-text">Information we collect</h2>
          <p>
            When you submit an enquiry form, we may collect your name, company
            name, email address, telephone number, area of interest and message
            content.
          </p>
          <h2 className="text-xl font-bold text-primary-text">How we use information</h2>
          <p>
            Enquiry information is used to respond to your request and to
            provide relevant information about our products, systems and
            services. We do not sell personal information.
          </p>
          <h2 className="text-xl font-bold text-primary-text">Storage and security</h2>
          <p>
            Enquiry data is stored in Supabase when configured, with access
            limited to authorized personnel through database security policies.
            Until Supabase is configured, form submissions are not accepted for
            storage.
          </p>
          <h2 className="text-xl font-bold text-primary-text">Contact</h2>
          <p>
            For privacy-related questions, use the contact channels published on
            this website once verified company details are configured.
          </p>
        </Container>
      </section>
    </>
  );
}
