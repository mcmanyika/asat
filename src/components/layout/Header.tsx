import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { DesktopNavigation } from "@/components/layout/DesktopNavigation";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Container } from "@/components/shared/Container";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { getConfiguredContactFields, siteConfig } from "@/config/site";

export function Header() {
  const contact = getConfiguredContactFields();
  const hasTopBar =
    Boolean(contact.phone || contact.email || contact.businessHours) ||
    Object.values(siteConfig.socialLinks).some((value) => value.trim());

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm"
      style={
        {
          "--header-offset": hasTopBar ? "112px" : "73px",
        } as React.CSSProperties
      }
    >
      <TopBar />
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            width={180}
            height={48}
            className="h-10 w-auto object-contain sm:h-11"
            priority
          />
          <span className="hidden max-w-[11rem] text-xs leading-snug text-secondary-text lg:block xl:max-w-[13rem]">
            {siteConfig.tagline}
          </span>
        </Link>

        <DesktopNavigation />

        <div className="flex items-center gap-3">
          <ButtonLink
            href="/request-quote"
            className="hidden sm:inline-flex"
            size="sm"
          >
            Request a Quote
          </ButtonLink>
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
