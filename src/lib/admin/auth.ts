import "server-only";

import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type { StaffStatus, StaffUser } from "@/lib/admin/types";

export async function getStaffUser(): Promise<StaffUser | null> {
  // Auth/session reads are request-time only (Supabase may use Date.now()).
  await connection();

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("user_id, email, full_name, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || profile.status !== "approved") return null;

  return {
    id: profile.user_id,
    email: profile.email,
    fullName: profile.full_name,
    status: profile.status as StaffStatus,
  };
}

export async function requireStaffUser(): Promise<StaffUser> {
  const staff = await getStaffUser();
  if (!staff) {
    redirect("/admin/login");
  }
  return staff;
}

export async function getAuthUserEmail(): Promise<string | null> {
  await connection();

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
