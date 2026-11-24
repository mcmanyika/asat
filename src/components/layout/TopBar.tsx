import { Clock3, Mail, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/shared/SocialIcons";
import {
  getConfiguredContactFields,
  getConfiguredSocialLinks,
} from "@/config/site";

const socialIcons = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
} as const;

export function TopBar() {
  const contact = getConfiguredContactFields();
  const socialLinks = getConfiguredSocialLinks();

  const hasContact =
    contact.phone || contact.email || contact.businessHours;
  const hasContent = hasContact || socialLinks.length > 0;

  if (!hasContent) return null;

  return (
    <div className="border-b border-white/10 bg-navy text-white">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {contact.phone ? (
            <a
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 transition hover:text-accent-cyan"
            >
              <Phone className="size-3.5" aria-hidden />
              <span>{contact.phone}</span>
            </a>
          ) : null}
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1.5 transition hover:text-accent-cyan"
            >
              <Mail className="size-3.5" aria-hidden />
              <span>{contact.email}</span>
            </a>
          ) : null}
          {contact.businessHours ? (
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock3 className="size-3.5" aria-hidden />
              <span>{contact.businessHours}</span>
            </span>
          ) : null}
        </div>
        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-3">
            {socialLinks.map(([key, url]) => {
              const Icon = socialIcons[key];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="transition hover:text-accent-cyan"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        ) : null}
      </Container>
    </div>
  );
}
