import type { IndustryItem } from "@/types";

export const industries: IndustryItem[] = [
  {
    slug: "retail",
    name: "Retail and Supermarkets",
    href: "/industries/retail",
    category: "industry",
    interest: "business-systems",
    shortDescription:
      "Technology products, POS systems and consulting for retail operations.",
    description:
      "ASAT Technologies supports retail and supermarket businesses with point-of-sale systems, hardware, IT infrastructure and retail consulting designed to improve operational efficiency.",
    image: "/images/divisions/business-systems-photo.png",
    imageAlt: "Retail and supermarket technology environment",
    relatedProducts: ["pos-machines", "cash-drawers", "scanners", "printers"],
    relatedSystems: ["retail-pos"],
    relatedSolutions: ["networking", "antivirus"],
    relatedConsulting: ["retail-consulting", "business-analytics"],
  },
  {
    slug: "pharmacy",
    name: "Pharmacies",
    href: "/industries/pharmacy",
    category: "industry",
    interest: "business-systems",
    shortDescription:
      "Pharmacy-focused POS, inventory-oriented technology and IT support.",
    description:
      "Pharmacy businesses benefit from specialized POS systems, reliable hardware and secure IT infrastructure. ASAT Technologies helps pharmacies identify solutions suited to pharmaceutical operations.",
    image: "/images/systems/pharmacy-pos.png",
    imageAlt: "Pharmacy technology and point-of-sale environment",
    relatedProducts: ["pos-machines", "scanners", "printers", "laptops"],
    relatedSystems: ["pharmacy-pos"],
    relatedSolutions: ["antivirus", "firewalls", "networking"],
    relatedConsulting: ["security-analysis", "business-analytics"],
  },
  {
    slug: "hospitality",
    name: "Restaurants and Hospitality",
    href: "/industries/hospitality",
    category: "industry",
    interest: "business-systems",
    shortDescription:
      "Restaurant POS, hardware and connectivity for hospitality venues.",
    description:
      "Restaurants and hospitality operators rely on dependable POS technology, peripherals and network connectivity. ASAT Technologies provides solutions that support service quality and operational control.",
    image: "/images/systems/restaurant-pos.png",
    imageAlt: "Restaurant and hospitality point-of-sale technology",
    relatedProducts: ["pos-machines", "printers", "cash-drawers"],
    relatedSystems: ["restaurant-pos"],
    relatedSolutions: ["networking", "antivirus"],
    relatedConsulting: ["retail-consulting", "business-analytics"],
  },
  {
    slug: "corporate",
    name: "Corporate Businesses",
    href: "/industries/corporate",
    category: "industry",
    interest: "general",
    shortDescription:
      "Enterprise systems, hardware, cybersecurity and consulting for organizations.",
    description:
      "Corporate businesses need integrated technology spanning hardware, enterprise systems, secure infrastructure and advisory support. ASAT Technologies helps organizations modernize with a business-first approach.",
    image: "/images/divisions/products-photo.png",
    imageAlt: "Corporate business technology environment",
    relatedProducts: ["laptops", "desktops", "printers"],
    relatedSystems: ["microsoft-dynamics-365-business-central"],
    relatedSolutions: ["antivirus", "firewalls", "networking"],
    relatedConsulting: ["security-analysis", "business-analytics"],
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((item) => item.slug === slug);
}
