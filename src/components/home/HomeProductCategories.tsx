import { Suspense } from "react";
import { ProductCategories } from "@/components/home/ProductCategories";
import { getProducts } from "@/lib/content/queries";

function ProductCategoriesFallback() {
  return (
    <section className="bg-light-bg py-16 md:py-20" aria-hidden>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse border border-border bg-white"
          />
        ))}
      </div>
    </section>
  );
}

async function HomeProductCategoriesInner() {
  const products = await getProducts();
  return <ProductCategories products={products} />;
}

export function HomeProductCategories() {
  return (
    <Suspense fallback={<ProductCategoriesFallback />}>
      <HomeProductCategoriesInner />
    </Suspense>
  );
}
