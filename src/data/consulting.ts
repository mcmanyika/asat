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
      "Real-time dashboards, automated financial reporting and AI-powered analytics from a single source of truth.",
    description:
      "We build real-time dashboards, automated financial reporting and AI-powered analytics that turn scattered spreadsheets and disconnected systems into a single source of executive truth — updated by the minute, not the month-end. Direct connections to ERPs, POS systems and accounting platforms (including Microsoft Dynamics 365 Business Central) via ODBC/API support scheduled and near-real-time incremental syncs with audit logging. A modelled warehouse moves data through staging, reporting and analytics layers instead of ad-hoc exports, with data quality checks and anomaly flags built into the pipeline itself.",
    image: "/images/divisions/consulting-photo.png",
    imageAlt: "Business analytics and performance reporting",
    highlights: [
      "Real-time dashboards and automated financial reporting",
      "AI-powered analytics for executive decision support",
      "Direct ERP, POS and accounting connections via ODBC/API",
      "Scheduled and near-real-time incremental syncs with audit logging",
      "Modelled warehouse: staging → reporting → analytics",
      "Data quality checks and anomaly flags in the pipeline",
    ],
  },
];

export function getConsultingBySlug(slug: string) {
  return consultingServices.find((item) => item.slug === slug);
}
