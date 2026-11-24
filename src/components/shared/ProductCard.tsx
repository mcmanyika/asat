import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductCategory;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={product.href}
      className={cn(
        "group flex h-full flex-col border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="relative mb-4 flex aspect-square items-center justify-center bg-white p-2">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={240}
          height={240}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="text-center text-sm font-semibold text-primary-text transition-colors group-hover:text-corporate-blue sm:text-base">
        {product.name}
      </h3>
    </Link>
  );
}
