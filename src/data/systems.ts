import type { SystemItem } from "@/types";

export const systems: SystemItem[] = [
  {
    slug: "microsoft-dynamics-365-business-central",
    name: "Microsoft Dynamics 365 Business Central",
    href: "/systems/microsoft-dynamics-365-business-central",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Integrated enterprise resource planning for finance, inventory, procurement, sales and reporting.",
    description:
      "Microsoft Dynamics 365 Business Central helps organizations unify core business processes. ASAT Technologies supports businesses exploring Business Central as part of a broader systems and operations strategy. Detailed capability scope is confirmed with each client during discovery.",
    image: "/images/systems/business-central.png",
    imageAlt: "Enterprise business management system interface",
    highlights: [
      "Financial management support",
      "Inventory and procurement workflows",
      "Sales and business reporting",
      "Capability details subject to client discovery",
    ],
  },
  {
    slug: "retail-pos",
    name: "Retail POS Systems",
    href: "/systems/retail-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Point-of-sale technology for retail sales, stock management and store efficiency.",
    description:
      "Retail POS systems help stores manage sales transactions, stock visibility and day-to-day operational control. ASAT Technologies works with retailers to identify POS approaches suited to their format and growth plans.",
    image: "/images/systems/retail-pos.png",
    imageAlt: "Retail point-of-sale system",
    highlights: [
      "Sales and checkout workflows",
      "Stock management support",
      "Designed for retail operations",
    ],
  },
  {
    slug: "pharmacy-pos",
    name: "Pharmacy POS Systems",
    href: "/systems/pharmacy-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "Specialized POS solutions for pharmacy operations and pharmaceutical inventory.",
    description:
      "Pharmacy environments require careful inventory control and operational reliability. ASAT Technologies provides pharmacy-focused POS solutions designed to support dispensing workflows and pharmaceutical stock management.",
    image: "/images/systems/pharmacy-pos.png",
    imageAlt: "Pharmacy point-of-sale system",
    highlights: [
      "Pharmacy-oriented workflows",
      "Pharmaceutical inventory support",
      "Operational reliability focus",
    ],
  },
  {
    slug: "restaurant-pos",
    name: "Restaurant POS Systems",
    href: "/systems/restaurant-pos",
    category: "system",
    interest: "business-systems",
    shortDescription:
      "POS technology for restaurant operations, order management and service.",
    description:
      "Restaurant POS systems support order capture, kitchen coordination and guest service. ASAT Technologies helps hospitality operators evaluate POS solutions aligned to their service model.",
    image: "/images/systems/restaurant-pos.png",
    imageAlt: "Restaurant point-of-sale system",
    highlights: [
      "Order management support",
      "Service-oriented workflows",
      "Suitable for hospitality venues",
    ],
  },
];

export function getSystemBySlug(slug: string) {
  return systems.find((item) => item.slug === slug);
}
