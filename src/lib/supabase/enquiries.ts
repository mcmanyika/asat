import { randomUUID } from "crypto";
import { notifyStaffOfEnquiry } from "@/lib/email/enquiry-notification";
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

  // Pre-generate id so we don't need SELECT after INSERT (anon RLS is insert-only).
  const id = randomUUID();

  const { error } = await supabase.from("enquiries").insert({
    id,
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
  });

  if (error) {
    console.error("Supabase enquiry insert failed:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    const permissionDenied =
      error.code === "42501" ||
      error.message.toLowerCase().includes("permission denied");

    return {
      ok: false as const,
      error: permissionDenied
        ? "Database permissions are missing. Run supabase/fix-grants.sql in the Supabase SQL Editor, then try again."
        : "Unable to save the enquiry right now. Please try again or use the contact form.",
    };
  }

  // Email failure should not fail the enquiry submission.
  try {
    await notifyStaffOfEnquiry({ ...input, id });
  } catch (notifyError) {
    console.error("Enquiry staff notification failed:", notifyError);
  }

  return { ok: true as const, id };
}
