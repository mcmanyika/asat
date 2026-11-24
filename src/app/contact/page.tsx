import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { EnquiryFormLoader } from "@/components/forms/EnquiryFormLoader";
import { getConfiguredContactFields, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} for technology products, business systems, IT solutions and consulting enquiries.`,
  path: "/contact",
});

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; subject?: string }>;
}) {
  const contact = getConfiguredContactFields();

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Speak with ASAT Technologies about products, systems, IT solutions or consulting."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <section className="bg-light-bg py-14 md:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="border border-border bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-primary-text">
                Get in touch
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary-text">
                Share your enquiry using the form. Verified contact channels are
                displayed here when configured.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-primary-text">
                {contact.address ? (
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 text-corporate-blue" />
                    <span>{contact.address}</span>
                  </li>
                ) : null}
                {contact.phone ? (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-3 hover:text-corporate-blue"
                    >
                      <Phone className="size-4 text-corporate-blue" />
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-3 hover:text-corporate-blue"
                    >
                      <Mail className="size-4 text-corporate-blue" />
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.businessHours ? (
                  <li className="text-secondary-text">{contact.businessHours}</li>
                ) : null}
                {!contact.address &&
                !contact.phone &&
                !contact.email &&
                !contact.businessHours ? (
                  <li className="text-secondary-text">
                    Contact details are pending verification and will appear
                    once configured in site settings.
                  </li>
                ) : null}
              </ul>
            </aside>
            <EnquiryFormLoader type="contact" searchParams={searchParams} />
          </div>
        </Container>
      </section>
    </>
  );
}
