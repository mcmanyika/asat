export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNavigation: NavItem[] = [
  { label: "About Us", href: "/about" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Laptops", href: "/products/laptops" },
      { label: "All-in-One Desktops", href: "/products/desktops" },
      { label: "Printers", href: "/products/printers" },
      { label: "POS Machines", href: "/products/pos-machines" },
      { label: "Cash Drawers", href: "/products/cash-drawers" },
      { label: "Scanners", href: "/products/scanners" },
    ],
  },
  {
    label: "Business Systems",
    href: "/systems",
    children: [
      {
        label: "Microsoft Dynamics 365 Business Central",
        href: "/systems/microsoft-dynamics-365-business-central",
      },
      { label: "Retail POS", href: "/systems/retail-pos" },
      { label: "Pharmacy POS", href: "/systems/pharmacy-pos" },
      { label: "Restaurant POS", href: "/systems/restaurant-pos" },
      {
        label: "Electronic Label Solution",
        href: "/systems/electronic-label-solution",
      },
    ],
  },
  {
    label: "IT Solutions",
    href: "/solutions",
    children: [
      { label: "Antivirus", href: "/solutions/antivirus" },
      { label: "Firewalls", href: "/solutions/firewalls" },
      { label: "Networking", href: "/solutions/networking" },
    ],
  },
  {
    label: "Consulting",
    href: "/consulting",
    children: [
      { label: "Retail Consulting", href: "/consulting/retail-consulting" },
      { label: "Security Analysis", href: "/consulting/security-analysis" },
      { label: "Business Analytics", href: "/consulting/business-analytics" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Retail and Supermarkets", href: "/industries/retail" },
      { label: "Pharmacies", href: "/industries/pharmacy" },
      { label: "Restaurants and Hospitality", href: "/industries/hospitality" },
      { label: "Corporate Businesses", href: "/industries/corporate" },
    ],
  },
];

export const footerLinks = {
  products: [
    { label: "Laptops", href: "/products/laptops" },
    { label: "Desktops", href: "/products/desktops" },
    { label: "Printers", href: "/products/printers" },
    { label: "POS Machines", href: "/products/pos-machines" },
    { label: "Cash Drawers", href: "/products/cash-drawers" },
    { label: "Scanners", href: "/products/scanners" },
  ],
  systems: [
    {
      label: "Microsoft Dynamics 365 Business Central",
      href: "/systems/microsoft-dynamics-365-business-central",
    },
    { label: "Retail POS", href: "/systems/retail-pos" },
    { label: "Pharmacy POS", href: "/systems/pharmacy-pos" },
    { label: "Restaurant POS", href: "/systems/restaurant-pos" },
    {
      label: "Electronic Label Solution",
      href: "/systems/electronic-label-solution",
    },
  ],
  solutionsConsulting: [
    { label: "Antivirus", href: "/solutions/antivirus" },
    { label: "Firewalls", href: "/solutions/firewalls" },
    { label: "Networking", href: "/solutions/networking" },
    { label: "Retail Consulting", href: "/consulting/retail-consulting" },
    { label: "Security Analysis", href: "/consulting/security-analysis" },
    { label: "Business Analytics", href: "/consulting/business-analytics" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms" },
  ],
} as const;
