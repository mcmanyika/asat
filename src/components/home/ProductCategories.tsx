"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealItem, RevealStagger } from "@/components/home/RevealStagger";
import type { ProductCategory } from "@/types";

type ProductCategoriesProps = {
  products: ProductCategory[];
};

export function ProductCategories({ products }: ProductCategoriesProps) {
  return (
    <section className="bg-light-bg py-16 md:py-20">
      <Container>
        <SectionHeading
          title="Our Technology Products"
          description="A comprehensive range of business technology products for modern organizations."
          action={
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue hover:text-gold-dark"
            >
              View All Products
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        />
        <RevealStagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {products.map((product) => (
            <RevealItem key={product.slug} className="h-full">
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  );
}
