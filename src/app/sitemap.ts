import type { MetadataRoute } from "next";
import { getAllCatalogHrefs } from "@/lib/content/queries";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/about",
    "/products",
    "/systems",
    "/solutions",
    "/consulting",
    "/industries",
    "/contact",
    "/request-quote",
    "/request-demo",
    "/request-consultation",
    "/privacy-policy",
    "/terms",
  ];

  const dynamicRoutes = await getAllCatalogHrefs();

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified: "2026-11-24",
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
