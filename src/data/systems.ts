import type { SystemItem } from "@/types";

export const systems: SystemItem[] = [
  {
    slug: "microsoft-dynamics-365-business-central",
    name: "Microsoft Dynamics 365 Business Central",
    href: "/systems/microsoft-dynamics-365-business-central",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "End-to-end ERP with built-in AI, role-based workspaces and native Microsoft cloud integration.",
    description:
      "Microsoft Dynamics 365 Business Central connects general ledger, cash flow, inventory, warehousing, purchasing, sales, project accounting and manufacturing on a single codebase. It includes Copilot assistance, workflow automation via Power Automate, and specialized AI agents such as expense, sales order and payables agents. Role Centers customize home screens and quick actions to match each user's daily tasks. Native Microsoft integration works directly inside Outlook, Excel, Teams and Power BI, reducing app switching and manual data entry. The scalable cloud model is hosted by Microsoft with automatic biannual feature updates, managed security and modular growth from Essentials to Premium plans. Architecture expands through APIs, the Power Platform and third-party add-ons — including retail and hospitality extensions — as needs evolve.",
    image: "/images/systems/business-central.png",
    imageAlt: "Enterprise business management system interface",
    highlights: [
      "End-to-end finance, inventory, purchasing, sales and manufacturing",
      "Built-in Copilot, Power Automate and specialized AI agents",
      "Role-based workspaces tailored to daily tasks",
      "Native Outlook, Excel, Teams and Power BI integration",
      "Scalable Microsoft-hosted cloud with modular Essentials to Premium plans",
      "Extensible via APIs, Power Platform and industry add-ons",
    ],
  },
  {
    slug: "retail-pos",
    name: "Retail POS Systems",
    href: "/systems/retail-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Retail POS linked to Business Central with offline capability, ZIMRA compliance and full audit trail.",
    description:
      "ASAT Retail POS provides one source of truth linked to Microsoft Dynamics 365 Business Central. Sales sync automatically, stores can keep trading with offline POS functionality, and teams work with different permission levels, proper cash-up reports, ZIMRA-compliant FDMS, integrated swipe machines, a change solution and a full audit trail.",
    image: "/images/systems/retail-pos.png",
    imageAlt: "Retail point-of-sale system",
    highlights: [
      "One source of truth linked to Microsoft Dynamics Business Central",
      "Automatic sales sync",
      "Offline POS functionality",
      "Role-based permissions",
      "Proper cash-up reports",
      "ZIMRA compliant (FDMS solution)",
      "Integrated swipe machines",
      "Change solution available",
      "Full audit trail",
    ],
  },
  {
    slug: "pharmacy-pos",
    name: "Pharmacy POS Systems",
    href: "/systems/pharmacy-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Pharmacy POS linked to Business Central with health-provider integration and ZIMRA compliance.",
    description:
      "ASAT Pharmacy POS provides one source of truth linked to Microsoft Dynamics 365 Business Central and is fully integrated into health service providers. Sales sync automatically, pharmacies can continue trading offline, and operations are supported with permission controls, cash-up reports, ZIMRA-compliant FDMS, integrated swipe machines, a change solution and a full audit trail.",
    image: "/images/systems/pharmacy-pos.png",
    imageAlt: "Pharmacy point-of-sale system",
    highlights: [
      "One source of truth linked to Microsoft Dynamics Business Central",
      "Fully integrated into health service providers",
      "Automatic sales sync",
      "Offline POS functionality",
      "Role-based permissions",
      "Proper cash-up reports",
      "ZIMRA compliant (FDMS solution)",
      "Integrated swipe machines",
      "Change solution available",
      "Full audit trail",
    ],
  },
  {
    slug: "restaurant-pos",
    name: "Restaurant POS Systems",
    href: "/systems/restaurant-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Restaurant POS linked to Business Central with tablet ordering, table management and offline support.",
    description:
      "ASAT Restaurant POS provides one source of truth linked to Microsoft Dynamics 365 Business Central. It supports tablet ordering, table management, automatic sales sync, offline POS functionality, different permission levels, proper cash-up reports, ZIMRA-compliant FDMS and integrated swipe machines.",
    image: "/images/systems/restaurant-pos.png",
    imageAlt: "Restaurant point-of-sale system",
    highlights: [
      "One source of truth linked to Microsoft Dynamics Business Central",
      "Tablet capability for ordering",
      "Table management",
      "Automatic sales sync",
      "Offline POS functionality",
      "Role-based permissions",
      "Proper cash-up reports",
      "ZIMRA compliant (FDMS solution)",
      "Integrated swipe machines",
    ],
  },
  {
    slug: "electronic-label-solution",
    name: "Electronic Label Solution",
    href: "/systems/electronic-label-solution",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Electronic shelf labels for real-time price changes, stock insight and promotion visibility.",
    description:
      "ASAT Electronic Label Solution enables real-time price changes on your shelves. Tags can display stock on hand and rate of sale to support ordering, flash to highlight products on promotion, and are available in different sizes to suit store layouts.",
    image: "/images/systems/retail-pos.png",
    imageAlt: "Electronic shelf labels in a retail environment",
    highlights: [
      "Real-time price changes on your shelves",
      "Stock on hand and rate of sale display to support ordering",
      "Flashing tags to show products on promotion",
      "Different sizes of price tags",
    ],
  },
];

export function getSystemBySlug(slug: string) {
  return systems.find((item) => item.slug === slug);
}
