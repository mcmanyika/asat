export const LANDING_SECTIONS_KEY = "landing_sections";

export const LANDING_SECTION_META = [
  {
    key: "hero",
    label: "Hero",
    description: "Top banner with main headline and CTAs",
  },
  {
    key: "companyIntroduction",
    label: "Company introduction",
    description: "Technology. Expertise. Business Transformation.",
  },
  {
    key: "businessDivisions",
    label: "Core business divisions",
    description: "Products, systems, IT solutions and consulting cards",
  },
  {
    key: "productCategories",
    label: "Technology products",
    description: "Product category grid",
  },
  {
    key: "finalCta",
    label: "Final call to action",
    description: "Bottom enquiry CTA band",
  },
] as const;

export type LandingSectionKey = (typeof LANDING_SECTION_META)[number]["key"];

export type LandingSectionsVisibility = Record<LandingSectionKey, boolean>;

export const DEFAULT_LANDING_SECTIONS: LandingSectionsVisibility = {
  hero: true,
  companyIntroduction: true,
  businessDivisions: true,
  productCategories: true,
  finalCta: true,
};

export function parseLandingSections(raw: string | null | undefined) {
  const next: LandingSectionsVisibility = { ...DEFAULT_LANDING_SECTIONS };
  if (!raw?.trim()) return next;

  try {
    const parsed = JSON.parse(raw) as Partial<
      Record<LandingSectionKey, unknown>
    >;
    for (const { key } of LANDING_SECTION_META) {
      if (typeof parsed[key] === "boolean") {
        next[key] = parsed[key];
      }
    }
  } catch {
    return next;
  }

  return next;
}
