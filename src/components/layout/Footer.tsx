import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/shared/SocialIcons";
import { footerLinks } from "@/config/navigation";
import {
  getConfiguredContactFields,
  getConfiguredSocialLinks,
  siteConfig,
} from "@/config/site";

const socialIcons = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
} as const;

export function Footer() {
  const contact = getConfiguredContactFields();
  const socialLinks = getConfiguredSocialLinks();
  const hasContact =
    contact.address ||
    contact.phone ||
    contact.email ||
    contact.whatsapp ||
    contact.businessHours;

  return (
    <footer className="bg-navy text-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo/asat-logo-white.png"
              alt={`${siteConfig.name} logo`}
              width={180}
              height={48}
              className="mb-4 h-10 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed text-slate-300">
              {siteConfig.tagline} Enterprise technology products, business
              systems, IT infrastructure and professional consulting services.
            </p>
            {socialLinks.length > 0 ? (
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="inline-flex size-9 items-center justify-center border border-white/15 transition hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Business Systems
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {footerLinks.systems.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Solutions & Consulting
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {footerLinks.solutionsConsulting.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Contact
            </h3>
            {hasContact ? (
              <ul className="space-y-3 text-sm text-slate-300">
                {contact.address ? (
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{contact.address}</span>
                  </li>
                ) : null}
                {contact.phone ? (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 hover:text-white"
                    >
                      <Phone className="size-4" aria-hidden />
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 hover:text-white"
                    >
                      <Mail className="size-4" aria-hidden />
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.whatsapp ? (
                  <li className="text-slate-300">WhatsApp: {contact.whatsapp}</li>
                ) : null}
                {contact.businessHours ? (
                  <li className="text-slate-300">{contact.businessHours}</li>
                ) : null}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                Contact details will appear here once verified company
                information is configured.
              </p>
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
