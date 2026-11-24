import type { ConsultingItem } from "@/types";

export const consultingServices: ConsultingItem[] = [
  {
    slug: "retail-consulting",
    name: "Retail Consulting",
    href: "/consulting/retail-consulting",
    category: "consulting",
    interest: "consulting",
    shortDescription:
      "Advisory support for retail operations, technology and process improvement.",
    description:
      "Retail consulting from ASAT Technologies helps organizations align technology choices with store operations, inventory practices and customer experience goals.",
    image: "/images/divisions/consulting-photo.png",
    imageAlt: "Retail business consulting discussion",
    highlights: [
      "Retail operations focus",
      "Technology and process alignment",
      "Practical implementation guidance",
    ],
  },
  {
    slug: "security-analysis",
    name: "Security Analysis",
    href: "/consulting/security-analysis",
    category: "consulting",
    interest: "consulting",
    shortDescription:
      "Structured analysis to strengthen security posture and risk awareness.",
    description:
      "Security analysis engagements help businesses understand exposure areas across systems and infrastructure, and prioritize practical improvements.",
    image: "/images/divisions/it-solutions-photo.png",
    imageAlt: "Security analysis and risk assessment",
    highlights: [
      "Risk-aware assessment",
      "Infrastructure and systems focus",
      "Actionable improvement priorities",
    ],
  },
  {
    slug: "business-analytics",
    name: "Business Analytics",
    href: "/consulting/business-analytics",
    category: "consulting",
    interest: "consulting",
    shortDescription:
      "Analytics guidance to improve visibility into business performance.",
    description:
      "Business analytics consulting helps organizations turn operational data into clearer decision support — from sales and inventory insights to broader performance reporting.",
    image: "/images/divisions/consulting-photo.png",
    imageAlt: "Business analytics and performance reporting",
    highlights: [
      "Performance visibility",
      "Operational insight support",
      "Decision-oriented reporting",
    ],
  },
];

export function getConsultingBySlug(slug: string) {
  return consultingServices.find((item) => item.slug === slug);
}
