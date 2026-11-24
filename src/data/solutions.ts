import type { SolutionItem } from "@/types";

export const solutions: SolutionItem[] = [
  {
    slug: "antivirus",
    name: "Antivirus Solutions",
    href: "/solutions/antivirus",
    category: "solution",
    interest: "it-solutions",
    shortDescription:
      "Business-focused endpoint protection and malware prevention.",
    description:
      "Antivirus and endpoint protection solutions help organizations reduce the risk of malware and related threats across workstations and devices. ASAT Technologies advises on business-oriented protection approaches that fit your infrastructure.",
    image: "/images/divisions/it-solutions-photo.png",
    imageAlt: "Endpoint security and antivirus protection",
    highlights: [
      "Endpoint malware prevention",
      "Business-focused protection options",
      "Aligned with broader IT security planning",
    ],
  },
  {
    slug: "firewalls",
    name: "Firewalls",
    href: "/solutions/firewalls",
    category: "solution",
    interest: "it-solutions",
    shortDescription:
      "Network security and protection against unauthorized access.",
    description:
      "Firewall solutions form a foundational layer of network security. ASAT Technologies helps businesses evaluate firewall approaches that protect connectivity while supporting operational requirements.",
    image: "/images/divisions/it-solutions-photo.png",
    imageAlt: "Network firewall security",
    highlights: [
      "Unauthorized access protection",
      "Network perimeter security",
      "Supports secure business connectivity",
    ],
  },
  {
    slug: "networking",
    name: "Networking Solutions",
    href: "/solutions/networking",
    category: "solution",
    interest: "it-solutions",
    shortDescription:
      "Reliable connectivity, network equipment and business infrastructure.",
    description:
      "Reliable networking underpins modern business systems and communications. ASAT Technologies supports organizations with networking solutions that keep people, devices and services connected.",
    image: "/images/solutions/network-server.png",
    imageAlt: "Business network and server infrastructure",
    highlights: [
      "Business connectivity",
      "Network equipment guidance",
      "Infrastructure reliability focus",
    ],
  },
];

export function getSolutionBySlug(slug: string) {
  return solutions.find((item) => item.slug === slug);
}
