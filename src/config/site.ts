export const siteConfig = {
  name: "ASAT Technologies",
  shortName: "ASAT",
  tagline: "Integrated Technology. Intelligent Business.",
  description:
    "ASAT Technologies provides enterprise business systems, Microsoft Dynamics 365 Business Central, POS solutions, computer hardware, cybersecurity, networking and professional business consulting services.",
  defaultTitle:
    "ASAT Technologies | Enterprise Technology & Business Solutions",
  logo: "/images/logo/asat-logo.png",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://asat.example.com",
  contact: {
    phone: "+263 77 238 4466" as string,
    email: "info@asat-technologies.com" as string,
    whatsapp: "+263772384466" as string,
    address: "" as string,
    businessHours: "Mon - Fri: 8:00 AM - 5:00 PM" as string,
  },
  socialLinks: {
    facebook: "" as string,
    linkedin: "" as string,
    instagram: "" as string,
    youtube: "" as string,
  },
};

export type SiteConfig = typeof siteConfig;

export function hasValue(value: string | undefined | null): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function getConfiguredSocialLinks() {
  return (
    Object.entries(siteConfig.socialLinks) as [
      keyof typeof siteConfig.socialLinks,
      string,
    ][]
  ).filter(([, url]) => hasValue(url));
}

export function getConfiguredContactFields() {
  return {
    phone: hasValue(siteConfig.contact.phone)
      ? siteConfig.contact.phone
      : null,
    email: hasValue(siteConfig.contact.email)
      ? siteConfig.contact.email
      : null,
    whatsapp: hasValue(siteConfig.contact.whatsapp)
      ? siteConfig.contact.whatsapp
      : null,
    address: hasValue(siteConfig.contact.address)
      ? siteConfig.contact.address
      : null,
    businessHours: hasValue(siteConfig.contact.businessHours)
      ? siteConfig.contact.businessHours
      : null,
  };
}
