import { getConfiguredContactFields, siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { systems } from "@/data/systems";
import { solutions } from "@/data/solutions";
import { consultingServices } from "@/data/consulting";

export function buildWhatsAppMessage(pathname: string) {
  const product = products.find((item) => item.href === pathname);
  if (product) {
    return `Hello ${siteConfig.name}, I would like to enquire about your ${product.name} solutions.`;
  }

  const system = systems.find((item) => item.href === pathname);
  if (system) {
    return `Hello ${siteConfig.name}, I would like to enquire about ${system.name}.`;
  }

  const solution = solutions.find((item) => item.href === pathname);
  if (solution) {
    return `Hello ${siteConfig.name}, I would like to enquire about your ${solution.name}.`;
  }

  const consulting = consultingServices.find((item) => item.href === pathname);
  if (consulting) {
    return `Hello ${siteConfig.name}, I would like to enquire about ${consulting.name}.`;
  }

  return `Hello ${siteConfig.name}, I would like to enquire about your business technology solutions.`;
}

export function getWhatsAppHref(pathname: string) {
  const { whatsapp } = getConfiguredContactFields();
  if (!whatsapp) return null;

  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppMessage(pathname))}`;
}
