import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gold !text-white hover:bg-gold-dark border border-gold",
  secondary:
    "bg-transparent !text-white border border-white hover:bg-white/10 hover:!text-white",
  outline:
    "bg-white text-gold-dark border border-gold hover:bg-light-bg",
  ghost:
    "bg-transparent text-gold-dark border border-transparent hover:bg-light-bg",
  light:
    "bg-white text-navy border border-white hover:bg-slate-100",
} as const;

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  size = "md",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
