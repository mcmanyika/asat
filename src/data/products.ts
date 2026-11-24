import type { ProductCategory } from "@/types";

export const products: ProductCategory[] = [
  {
    slug: "laptops",
    name: "Laptops",
    href: "/products/laptops",
    category: "product",
    interest: "products",
    shortDescription:
      "Reliable business laptops designed for productivity and mobility.",
    description:
      "ASAT Technologies supplies business-ready laptop solutions suited to office, field and executive environments. Our team helps organizations select configurations that balance performance, durability and total cost of ownership.",
    image: "/images/products/laptop.png",
    imageAlt: "Business laptop computer",
    highlights: [
      "Business-oriented configurations",
      "Performance for everyday productivity",
      "Guidance on deployment and accessories",
    ],
  },
  {
    slug: "desktops",
    name: "All-in-One Desktops",
    href: "/products/desktops",
    category: "product",
    interest: "products",
    shortDescription:
      "Space-efficient all-in-one desktops for modern workplaces.",
    description:
      "All-in-one desktop systems help organizations deliver a clean desk environment without compromising computing capability. Ideal for reception, retail back office and corporate workstations.",
    image: "/images/products/aio-desktop.png",
    imageAlt: "All-in-one desktop computer",
    highlights: [
      "Reduced cable clutter",
      "Suitable for front-of-house and office use",
      "Configurable for business workloads",
    ],
  },
  {
    slug: "printers",
    name: "Printers",
    href: "/products/printers",
    category: "product",
    interest: "products",
    shortDescription:
      "Document and receipt printing solutions for business operations.",
    description:
      "From office document printing to specialized receipt and label workflows, ASAT Technologies helps businesses select printers that support reliable day-to-day operations.",
    image: "/images/products/printer.png",
    imageAlt: "Business printer",
    highlights: [
      "Office and specialized printing options",
      "Support for retail and back-office workflows",
      "Enquiry-based product guidance",
    ],
  },
  {
    slug: "pos-machines",
    name: "POS Machines",
    href: "/products/pos-machines",
    category: "product",
    interest: "products",
    shortDescription:
      "Point-of-sale terminals built for retail and hospitality counters.",
    description:
      "POS machines form the hardware foundation of modern checkout experiences. We support organizations evaluating terminals that integrate with industry-focused POS software and peripherals.",
    image: "/images/products/pos-machine.png",
    imageAlt: "Point-of-sale terminal",
    highlights: [
      "Counter-ready terminal options",
      "Compatible with POS software ecosystems",
      "Suitable for retail and hospitality",
    ],
  },
  {
    slug: "cash-drawers",
    name: "Cash Drawers",
    href: "/products/cash-drawers",
    category: "product",
    interest: "products",
    shortDescription:
      "Secure cash drawers for point-of-sale environments.",
    description:
      "Cash drawers help retail and hospitality businesses manage cash securely at the point of sale. ASAT Technologies can advise on drawers that fit your POS setup and operational requirements.",
    image: "/images/products/cash-drawer.png",
    imageAlt: "Point-of-sale cash drawer",
    highlights: [
      "Designed for POS counters",
      "Supports secure cash handling",
      "Compatible with common POS setups",
    ],
  },
  {
    slug: "scanners",
    name: "Scanners",
    href: "/products/scanners",
    category: "product",
    interest: "products",
    shortDescription:
      "Barcode scanners for inventory, checkout and operations.",
    description:
      "Barcode scanners improve speed and accuracy across checkout, stock-taking and warehouse workflows. Explore options suited to retail, pharmacy and general business use.",
    image: "/images/products/barcode-scanner.png",
    imageAlt: "Barcode scanner",
    highlights: [
      "Checkout and inventory scanning",
      "Supports operational efficiency",
      "Guidance for the right form factor",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug);
}
