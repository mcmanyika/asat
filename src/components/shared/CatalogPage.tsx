import { Suspense } from "react";
import { CatalogGrid } from "@/components/shared/CatalogGrid";
import type { BreadcrumbItem, ContentItem } from "@/types";

type CatalogPageProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  imageFit?: "cover" | "contain";
  loadItems: () => Promise<ContentItem[]>;
};

function CatalogFallback({
  title,
  description,
  breadcrumbs,
}: Pick<CatalogPageProps, "title" | "description" | "breadcrumbs">) {
  return (
    <CatalogGrid
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      items={[]}
    />
  );
}

async function CatalogPageInner({
  title,
  description,
  breadcrumbs,
  imageFit,
  loadItems,
}: CatalogPageProps) {
  const items = await loadItems();
  return (
    <CatalogGrid
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      items={items}
      imageFit={imageFit}
    />
  );
}

export function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense
      fallback={
        <CatalogFallback
          title={props.title}
          description={props.description}
          breadcrumbs={props.breadcrumbs}
        />
      }
    >
      <CatalogPageInner {...props} />
    </Suspense>
  );
}
