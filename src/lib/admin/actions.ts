"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaffUser } from "@/lib/admin/auth";
import {
  ENQUIRY_NOTIFY_EMAILS_KEY,
  parseEmailList,
} from "@/lib/email/config";

export async function signInStaff(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("user_id, status")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "This account is not authorized for the staff dashboard. Create an account and wait for admin approval.",
    };
  }

  if (profile.status === "pending") {
    await supabase.auth.signOut();
    return {
      error:
        "Your account is waiting for admin approval. You will be able to sign in once an approved staff member confirms you.",
    };
  }

  if (profile.status === "rejected") {
    await supabase.auth.signOut();
    return {
      error:
        "Your staff access request was declined. Contact an ASAT administrator if you need access.",
    };
  }

  redirect("/admin");
}

export async function signOutStaff() {
  const supabase = await createSupabaseAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function signUpStaff(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your full name." };
  }

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin.replace(/\/$/, "")}/auth/callback?next=/admin/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Unable to create the account. Please try again." };
  }

  const profilePayload = {
    user_id: data.user.id,
    email,
    full_name: fullName,
    status: "pending" as const,
  };

  // Prefer service role so signup works even before the insert RLS policy is applied.
  const adminClient = createSupabaseServerClient();
  const profileClient = adminClient || supabase;
  const { error: profileError } = await profileClient
    .from("staff_profiles")
    .upsert(profilePayload, { onConflict: "user_id" });

  if (profileError) {
    return {
      error: `Account created, but the approval request could not be saved: ${profileError.message}. Run supabase/staff-approval.sql, then try again.`,
    };
  }

  // Always sign out so pending users cannot enter the dashboard.
  await supabase.auth.signOut();

  return {
    ok: true as const,
    pendingApproval: true as const,
    needsConfirmation: !data.session,
  };
}

export async function updateStaffAccessStatus(formData: FormData) {
  const actor = await requireStaffUser();

  const userId = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!userId || !["pending", "approved", "rejected"].includes(status)) {
    return { error: "Invalid staff status update." };
  }

  if (userId === actor.id && status !== "approved") {
    return { error: "You cannot remove your own approved access." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("staff_profiles")
    .update({ status })
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/staff");
  return { ok: true as const };
}

export async function updateStaffNotifyPreference(formData: FormData) {
  await requireStaffUser();

  const userId = String(formData.get("userId") || "");
  const enabled = String(formData.get("notifyOnEnquiry") || "") === "true";

  if (!userId) {
    return { error: "Missing staff member." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    return { error: "Staff profile not found." };
  }

  if (enabled && profile.status !== "approved") {
    return {
      error: "Only approved staff can receive enquiry email notifications.",
    };
  }

  const { error } = await supabase
    .from("staff_profiles")
    .update({ notify_on_enquiry: enabled })
    .eq("user_id", userId);

  if (error) {
    return {
      error:
        error.message.includes("notify_on_enquiry") || error.code === "42703"
          ? "Missing notify_on_enquiry column. Run supabase/staff-notify-emails.sql."
          : error.message,
    };
  }

  revalidatePath("/admin/staff");
  return { ok: true as const, enabled };
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000";
  const redirectTo = `${origin.replace(/\/$/, "")}/auth/callback?next=/admin/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true as const };
}

export async function updateStaffPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) {
    return { error: "Supabase is not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset link has expired. Request a new password reset email.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function updateEnquiryStatus(formData: FormData) {
  await requireStaffUser();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["new", "in_progress", "closed"].includes(status)) {
    return { error: "Invalid enquiry status update." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true as const };
}

export async function updateFeedbackStatus(formData: FormData) {
  await requireStaffUser();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["new", "reviewed", "closed"].includes(status)) {
    return { error: "Invalid feedback status update." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("feedback")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/feedback");
  revalidatePath(`/admin/feedback/${id}`);
  return { ok: true as const };
}

export async function updateEnquiryNotifyEmails(formData: FormData) {
  const staff = await requireStaffUser();
  const raw = String(formData.get("emails") || "");
  const emails = parseEmailList(raw);

  const invalid = emails.filter(
    (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  );
  if (invalid.length > 0) {
    return {
      error: `Invalid email address${invalid.length > 1 ? "es" : ""}: ${invalid.join(", ")}`,
    };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const value = emails.join(", ");
  const { error } = await supabase.from("app_settings").upsert(
    {
      key: ENQUIRY_NOTIFY_EMAILS_KEY,
      value,
      updated_at: new Date().toISOString(),
      updated_by: staff.id,
    },
    { onConflict: "key" },
  );

  if (error) {
    return {
      error:
        error.message.includes("does not exist") || error.code === "42P01"
          ? "Settings table missing. Run supabase/app-settings.sql in the Supabase SQL Editor."
          : error.message,
    };
  }

  revalidatePath("/admin/settings");
  return { ok: true as const, count: emails.length };
}
