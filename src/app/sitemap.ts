import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { systems } from "@/data/systems";
import { solutions } from "@/data/solutions";
import { consultingServices } from "@/data/consulting";
import { industries } from "@/data/industries";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const dynamicRoutes = [
    ...products.map((item) => item.href),
    ...systems.map((item) => item.href),
    ...solutions.map((item) => item.href),
    ...consultingServices.map((item) => item.href),
    ...industries.map((item) => item.href),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified: "2026-11-24",
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
