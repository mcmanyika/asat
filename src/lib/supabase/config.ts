const requiredPublicKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export type SupabaseConfigStatus = {
  configured: boolean;
  missing: string[];
};

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing = requiredPublicKeys.filter(
    (key) => !process.env[key]?.trim(),
  );
  return {
    configured: missing.length === 0,
    missing: [...missing],
  };
}

export function isEnquiryBackendReady() {
  return getSupabaseConfigStatus().configured;
}

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
