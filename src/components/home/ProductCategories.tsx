import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { products } from "@/data/products";

export function ProductCategories() {
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
