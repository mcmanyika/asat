import { randomUUID } from "crypto";
import {
  createSupabaseServerClient,
  type FeedbackInsert,
} from "@/lib/supabase/server";

export async function saveFeedback(input: FeedbackInsert) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false as const,
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const id = randomUUID();

  const { error } = await supabase.from("feedback").insert({
    id,
    category: input.category,
    rating: input.rating,
    full_name: input.full_name,
    email: input.email,
    message: input.message,
    privacy_consent: input.privacy_consent,
    source: input.source || "chatbot",
  });

  if (error) {
    console.error("Supabase feedback insert failed:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    const permissionDenied =
      error.code === "42501" ||
      error.message.toLowerCase().includes("permission denied");

    const missingTable =
      error.code === "42P01" ||
      error.message.toLowerCase().includes("does not exist");

    return {
      ok: false as const,
      error: permissionDenied || missingTable
        ? "Database permissions or the feedback table are missing. Run supabase/fix-grants.sql in the Supabase SQL Editor, then try again."
        : "Unable to save the feedback right now. Please try again later.",
    };
  }

  return { ok: true as const, id };
}
