import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export const ENQUIRY_NOTIFY_EMAILS_KEY = "enquiry_notify_emails";

export function parseEmailList(raw: string) {
  return raw
    .split(/[\n,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getEnvEnquiryNotifyEmails() {
  return parseEmailList(process.env.ENQUIRY_NOTIFY_EMAILS || "");
}

export function getEmailFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "ASAT Technologies <onboarding@resend.dev>"
  );
}

export async function getStoredEnquiryNotifyEmails() {
  const service = createSupabaseServerClient();
  const auth = await createSupabaseAuthServerClient();
  const client = service || auth;

  if (!client) return null;

  const { data, error } = await client
    .from("app_settings")
    .select("value")
    .eq("key", ENQUIRY_NOTIFY_EMAILS_KEY)
    .maybeSingle();

  if (error) {
    console.error("Failed to load enquiry_notify_emails setting:", error);
    return null;
  }

  if (!data) return null;
  return parseEmailList(data.value || "");
}

export async function getStaffEnquiryNotifyEmails() {
  const service = createSupabaseServerClient();
  const auth = await createSupabaseAuthServerClient();
  const client = service || auth;
  if (!client) return [];

  const { data, error } = await client
    .from("staff_profiles")
    .select("email")
    .eq("status", "approved")
    .eq("notify_on_enquiry", true);

  if (error) {
    console.error("Failed to load staff notify emails:", error);
    return [];
  }

  return (data || [])
    .map((row) => String(row.email || "").trim().toLowerCase())
    .filter(Boolean);
}

export async function getEnquiryNotifyEmails() {
  const staffEmails = await getStaffEnquiryNotifyEmails();
  const stored = await getStoredEnquiryNotifyEmails();
  const settingsEmails =
    stored !== null ? stored : getEnvEnquiryNotifyEmails();

  return [...new Set([...staffEmails, ...settingsEmails])];
}

export async function isEmailConfigured() {
  if (!process.env.RESEND_API_KEY?.trim()) return false;
  const recipients = await getEnquiryNotifyEmails();
  return recipients.length > 0;
}

export async function getEnquiryNotifyEmailsSetting() {
  const stored = await getStoredEnquiryNotifyEmails();
  if (stored !== null) {
    return {
      source: stored.length > 0 ? ("database" as const) : ("empty" as const),
      emails: stored.length > 0 ? stored : getEnvEnquiryNotifyEmails(),
      value: stored.join("\n"),
      envFallback: getEnvEnquiryNotifyEmails(),
    };
  }

  const envEmails = getEnvEnquiryNotifyEmails();
  return {
    source: "env" as const,
    emails: envEmails,
    value: envEmails.join("\n"),
    envFallback: envEmails,
  };
}
