"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  className?: string;
  compact?: boolean;
  label?: string;
};

export function WhatsAppButton({
  className,
  compact = false,
  label = "WhatsApp",
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  const href = getWhatsAppHref(pathname);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#25D366] text-sm font-semibold text-white transition hover:bg-[#1ebe57]",
        compact ? "size-8" : "h-10 px-3",
        className,
      )}
    >
      <MessageCircle className="size-4 shrink-0" aria-hidden />
      {!compact ? <span>{label}</span> : null}
    </a>
  );
}
