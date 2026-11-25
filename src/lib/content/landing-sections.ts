import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANDING_SECTIONS,
  LANDING_SECTIONS_KEY,
  parseLandingSections,
  type LandingSectionsVisibility,
} from "@/lib/content/landing-sections-shared";

export {
  DEFAULT_LANDING_SECTIONS,
  LANDING_SECTION_META,
  LANDING_SECTIONS_KEY,
  parseLandingSections,
  type LandingSectionKey,
  type LandingSectionsVisibility,
} from "@/lib/content/landing-sections-shared";

async function loadLandingSectionsVisibility(): Promise<LandingSectionsVisibility> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return DEFAULT_LANDING_SECTIONS;

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", LANDING_SECTIONS_KEY)
    .maybeSingle();

  if (error) {
    console.error("[landing-sections] failed to load:", error.message);
    return DEFAULT_LANDING_SECTIONS;
  }

  return parseLandingSections(data?.value);
}

export async function getLandingSectionsVisibility(): Promise<LandingSectionsVisibility> {
  "use cache";
  cacheTag("landing-sections");
  cacheLife("hours");
  return loadLandingSectionsVisibility();
}

/** Fresh read for admin settings (bypasses cache). */
export async function getLandingSectionsVisibilityFresh(): Promise<LandingSectionsVisibility> {
  return loadLandingSectionsVisibility();
}
