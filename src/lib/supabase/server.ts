import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export type EnquiryInsert = {
  type: "contact" | "quote" | "demo" | "consultation";
  full_name: string;
  company_name: string;
  email: string;
  telephone: string;
  interest: string;
  subject: string | null;
  message: string;
  privacy_consent: boolean;
  source?: string;
};

export type FeedbackInsert = {
  category: "website" | "product" | "service" | "chat" | "general";
  rating: number | null;
  full_name: string | null;
  email: string | null;
  message: string;
  privacy_consent: boolean;
  source?: string;
};

export function createSupabaseServerClient(): SupabaseClient | null {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return createClient(config.url, serviceRoleKey || config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
