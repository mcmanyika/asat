import type {
  ConsultingItem,
  IndustryItem,
  ProductCategory,
  SolutionItem,
  SystemItem,
} from "@/types";

export type ContentCategory =
  | "product"
  | "system"
  | "solution"
  | "consulting"
  | "industry";

const categoryBasePath: Record<ContentCategory, string> = {
  product: "/products",
  system: "/systems",
  solution: "/solutions",
  consulting: "/consulting",
  industry: "/industries",
};

export function contentHref(category: ContentCategory, slug: string) {
  return `${categoryBasePath[category]}/${slug}`;
}

export type ContentItemRow = {
  category: ContentCategory;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  image: string;
  image_alt: string;
  interest: ProductCategory["interest"] | null;
  highlights: string[] | null;
  related_products: string[] | null;
  related_systems: string[] | null;
  related_solutions: string[] | null;
  related_consulting: string[] | null;
  sort_order: number;
  published: boolean;
};

function baseFields(row: ContentItemRow) {
  return {
    slug: row.slug,
    name: row.name,
    href: contentHref(row.category, row.slug),
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    interest: row.interest ?? undefined,
    highlights: row.highlights?.length ? row.highlights : undefined,
  };
}

export function mapProduct(row: ContentItemRow): ProductCategory {
  return { ...baseFields(row), category: "product" };
}

export function mapSystem(row: ContentItemRow): SystemItem {
  return { ...baseFields(row), category: "system" };
}

export function mapSolution(row: ContentItemRow): SolutionItem {
  return { ...baseFields(row), category: "solution" };
}

export function mapConsulting(row: ContentItemRow): ConsultingItem {
  return { ...baseFields(row), category: "consulting" };
}

export function mapIndustry(row: ContentItemRow): IndustryItem {
  return {
    ...baseFields(row),
    category: "industry",
    relatedProducts: row.related_products ?? [],
    relatedSystems: row.related_systems ?? [],
    relatedSolutions: row.related_solutions ?? [],
    relatedConsulting: row.related_consulting ?? [],
  };
}
