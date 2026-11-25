import "server-only";

import { products as fallbackProducts } from "@/data/products";
import { systems as fallbackSystems } from "@/data/systems";
import { solutions as fallbackSolutions } from "@/data/solutions";
import { consultingServices as fallbackConsulting } from "@/data/consulting";
import { industries as fallbackIndustries } from "@/data/industries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapConsulting,
  mapIndustry,
  mapProduct,
  mapSolution,
  mapSystem,
  type ContentCategory,
  type ContentItemRow,
} from "@/lib/content/paths";
import type {
  ConsultingItem,
  IndustryItem,
  ProductCategory,
  SolutionItem,
  SystemItem,
} from "@/types";

async function fetchCategoryRows(category: ContentCategory) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("content_items")
    .select(
      "category, slug, name, short_description, description, image, image_alt, interest, highlights, related_products, related_systems, related_solutions, related_consulting, sort_order, published",
    )
    .eq("category", category)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(`[content] failed to load ${category}:`, error.message);
    return null;
  }

  return (data ?? []) as ContentItemRow[];
}

export async function getProducts(): Promise<ProductCategory[]> {
  const rows = await fetchCategoryRows("product");
  if (!rows?.length) return fallbackProducts;
  return rows.map(mapProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductCategory | undefined> {
  const products = await getProducts();
  return products.find((item) => item.slug === slug);
}

export async function getSystems(): Promise<SystemItem[]> {
  const rows = await fetchCategoryRows("system");
  if (!rows?.length) return fallbackSystems;
  return rows.map(mapSystem);
}

export async function getSystemBySlug(
  slug: string,
): Promise<SystemItem | undefined> {
  const systems = await getSystems();
  return systems.find((item) => item.slug === slug);
}

export async function getSolutions(): Promise<SolutionItem[]> {
  const rows = await fetchCategoryRows("solution");
  if (!rows?.length) return fallbackSolutions;
  return rows.map(mapSolution);
}

export async function getSolutionBySlug(
  slug: string,
): Promise<SolutionItem | undefined> {
  const solutions = await getSolutions();
  return solutions.find((item) => item.slug === slug);
}

export async function getConsultingServices(): Promise<ConsultingItem[]> {
  const rows = await fetchCategoryRows("consulting");
  if (!rows?.length) return fallbackConsulting;
  return rows.map(mapConsulting);
}

export async function getConsultingBySlug(
  slug: string,
): Promise<ConsultingItem | undefined> {
  const services = await getConsultingServices();
  return services.find((item) => item.slug === slug);
}

export async function getIndustries(): Promise<IndustryItem[]> {
  const rows = await fetchCategoryRows("industry");
  if (!rows?.length) return fallbackIndustries;
  return rows.map(mapIndustry);
}

export async function getIndustryBySlug(
  slug: string,
): Promise<IndustryItem | undefined> {
  const industries = await getIndustries();
  return industries.find((item) => item.slug === slug);
}

export async function getAllCatalogHrefs(): Promise<string[]> {
  const [products, systems, solutions, consulting, industries] =
    await Promise.all([
      getProducts(),
      getSystems(),
      getSolutions(),
      getConsultingServices(),
      getIndustries(),
    ]);

  return [
    ...products.map((item) => item.href),
    ...systems.map((item) => item.href),
    ...solutions.map((item) => item.href),
    ...consulting.map((item) => item.href),
    ...industries.map((item) => item.href),
  ];
}

export async function getContentNameByHref(
  href: string,
): Promise<string | undefined> {
  const [products, systems, solutions, consulting] = await Promise.all([
    getProducts(),
    getSystems(),
    getSolutions(),
    getConsultingServices(),
  ]);

  return (
    products.find((item) => item.href === href)?.name ||
    systems.find((item) => item.href === href)?.name ||
    solutions.find((item) => item.href === href)?.name ||
    consulting.find((item) => item.href === href)?.name
  );
}
