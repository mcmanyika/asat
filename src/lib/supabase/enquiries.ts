import {
  createSupabaseServerClient,
  type EnquiryInsert,
} from "@/lib/supabase/server";

export async function saveEnquiry(input: EnquiryInsert) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false as const,
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      type: input.type,
      full_name: input.full_name,
      company_name: input.company_name,
      email: input.email,
      telephone: input.telephone,
      interest: input.interest,
      subject: input.subject,
      message: input.message,
      privacy_consent: input.privacy_consent,
      source: input.source || "website",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase enquiry insert failed:", error);
    return {
      ok: false as const,
      error:
        "Unable to save the enquiry right now. Please try again or use the contact form.",
    };
  }

  return { ok: true as const, id: data.id as string };
}
