export type InterestArea =
  | "products"
  | "business-systems"
  | "it-solutions"
  | "consulting"
  | "general";

export type ContentItem = {
  slug: string;
  name: string;
  href: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  interest?: InterestArea;
  highlights?: string[];
};

export type ProductCategory = ContentItem & {
  category: "product";
};

export type SystemItem = ContentItem & {
  category: "system";
};

export type SolutionItem = ContentItem & {
  category: "solution";
};

export type ConsultingItem = ContentItem & {
  category: "consulting";
};

export type IndustryItem = ContentItem & {
  category: "industry";
  relatedProducts: string[];
  relatedSystems: string[];
  relatedSolutions: string[];
  relatedConsulting: string[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type EnquiryFormType = "contact" | "quote" | "demo" | "consultation";
