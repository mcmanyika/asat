import "server-only";

import { connection } from "next/server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
  DashboardStats,
  EnquiryRow,
  FeedbackRow,
  StaffProfileRow,
} from "@/lib/admin/types";

async function getAdminSupabase() {
  // Supabase auth/session code can touch Date.now(); force request-time rendering.
  await connection();
  return createSupabaseAuthServerClient();
}

function countBy(
  rows: { key: string }[],
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.key, (map.get(row.key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await getAdminSupabase();
  if (!supabase) return null;

  const [enquiriesRes, feedbackRes] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const enquiries = (enquiriesRes.data || []) as EnquiryRow[];
  const feedback = (feedbackRes.data || []) as FeedbackRow[];

  const rated = feedback.filter((item) => typeof item.rating === "number");
  const feedbackAvgRating =
    rated.length > 0
      ? Number(
          (
            rated.reduce((sum, item) => sum + (item.rating || 0), 0) /
            rated.length
          ).toFixed(1),
        )
      : null;

  return {
    enquiriesTotal: enquiries.length,
    enquiriesNew: enquiries.filter((item) => item.status === "new").length,
    enquiriesInProgress: enquiries.filter(
      (item) => item.status === "in_progress",
    ).length,
    enquiriesClosed: enquiries.filter((item) => item.status === "closed")
      .length,
    feedbackTotal: feedback.length,
    feedbackNew: feedback.filter((item) => item.status === "new").length,
    feedbackAvgRating,
    enquiriesByType: countBy(enquiries.map((item) => ({ key: item.type }))),
    enquiriesBySource: countBy(
      enquiries.map((item) => ({ key: item.source || "website" })),
    ),
    enquiriesByInterest: countBy(
      enquiries.map((item) => ({ key: item.interest })),
    ),
    recentEnquiries: enquiries.slice(0, 8),
    recentFeedback: feedback.slice(0, 8),
  };
}

export async function listEnquiries(filters?: {
  status?: string;
  type?: string;
  source?: string;
}): Promise<EnquiryRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.source) query = query.eq("source", filters.source);

  const { data } = await query;
  return (data || []) as EnquiryRow[];
}

export async function getEnquiryById(id: string): Promise<EnquiryRow | null> {
  const supabase = await getAdminSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as EnquiryRow | null) || null;
}

export async function listFeedback(filters?: {
  status?: string;
  category?: string;
}): Promise<FeedbackRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.category) query = query.eq("category", filters.category);

  const { data } = await query;
  return (data || []) as FeedbackRow[];
}

export async function getFeedbackById(id: string): Promise<FeedbackRow | null> {
  const supabase = await getAdminSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("feedback")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as FeedbackRow | null) || null;
}

export async function listStaffProfiles(): Promise<StaffProfileRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("staff_profiles")
    .select(
      "user_id, email, full_name, status, role, notify_on_enquiry, created_at",
    )
    .order("created_at", { ascending: false });

  return ((data || []) as StaffProfileRow[]).map((item) => ({
    ...item,
    role: item.role === "superuser" ? "superuser" : "staff",
    notify_on_enquiry: Boolean(item.notify_on_enquiry),
  }));
}
