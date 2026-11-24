import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { OpenChatButton } from "@/components/shared/OpenChatButton";
import { CTASection } from "@/components/shared/CTASection";
import type { BreadcrumbItem, ContentItem } from "@/types";

type DetailCta =
  | { label: string; href: string; action?: never }
  | { label: string; action: "open-chat"; href?: never };

type ContentDetailProps = {
  item: ContentItem;
  breadcrumbs: BreadcrumbItem[];
  primaryCta?: DetailCta;
  secondaryCta?: DetailCta;
  imageFit?: "cover" | "contain";
};

export function ContentDetail({
  item,
  breadcrumbs,
  primaryCta = { href: "/request-quote", label: "Request a Quote" },
  secondaryCta = { href: "/contact", label: "Contact Us" } as DetailCta,
  imageFit = "cover",
}: ContentDetailProps) {
  function renderCta(
    cta: DetailCta,
    variant: "primary" | "outline" = "primary",
  ) {
    if (cta.action === "open-chat") {
      return (
        <OpenChatButton variant={variant === "primary" ? "primary" : "outline"}>
          {cta.label}
        </OpenChatButton>
      );
    }

    return (
      <ButtonLink href={cta.href} variant={variant}>
        {cta.label}
      </ButtonLink>
    );
  }
  return (
    <>
      <PageHero
        title={item.name}
        description={item.shortDescription}
        breadcrumbs={breadcrumbs}
      />
      <section className="bg-white py-14 md:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div
              className={`relative overflow-hidden border border-border ${
                imageFit === "contain"
                  ? "aspect-square bg-white p-8"
                  : "aspect-4/3 bg-light-bg"
              }`}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className={imageFit === "contain" ? "object-contain p-8" : "object-cover"}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-base leading-relaxed text-secondary-text sm:text-lg">
                {item.description}
              </p>
              {item.highlights?.length ? (
                <ul className="mt-6 space-y-3">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-sm text-primary-text"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-corporate-blue"
                        aria-hidden
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {renderCta(primaryCta)}
                {renderCta(secondaryCta, "outline")}
              </div>
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
