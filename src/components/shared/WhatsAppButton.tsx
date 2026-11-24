"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { getConfiguredContactFields, siteConfig } from "@/config/site";
import { products } from "@/data/products";
import { systems } from "@/data/systems";
import { solutions } from "@/data/solutions";
import { consultingServices } from "@/data/consulting";

function buildMessage(pathname: string) {
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

export function WhatsAppButton() {
  const pathname = usePathname();
  const { whatsapp } = getConfiguredContactFields();

  if (!whatsapp) return null;

  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(buildMessage(pathname))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-20 z-50 inline-flex items-center gap-2 rounded-[4px] bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1ebe57] md:right-6 md:bottom-24"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
