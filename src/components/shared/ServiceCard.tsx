import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  linkLabel?: string;
  className?: string;
};

export function ServiceCard({
  title,
  description,
  href,
  icon: Icon,
  linkLabel = "Learn More",
  className,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="mb-5 flex size-12 items-center justify-center border border-border bg-light-bg text-corporate-blue">
        <Icon className="size-6" aria-hidden />
      </div>
      <h3 className="text-xl font-bold text-primary-text">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary-text">
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue transition-colors hover:text-gold-dark"
      >
        {linkLabel}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </article>
  );
}
