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

function sanitizeSearch(value?: string) {
  return (value || "").trim().replace(/[%_,]/g, " ").replace(/\s+/g, " ").trim();
}

type SortSpec = { column: string; ascending: boolean };

function resolveSort(
  sort: string | undefined,
  options: Record<string, SortSpec>,
  fallback: SortSpec,
): SortSpec {
  if (sort && options[sort]) return options[sort];
  return fallback;
}

const enquirySortOptions: Record<string, SortSpec> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "full_name", ascending: true },
  name_desc: { column: "full_name", ascending: false },
  company_asc: { column: "company_name", ascending: true },
  company_desc: { column: "company_name", ascending: false },
  status: { column: "status", ascending: true },
};

const feedbackSortOptions: Record<string, SortSpec> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "full_name", ascending: true },
  name_desc: { column: "full_name", ascending: false },
  rating_desc: { column: "rating", ascending: false },
  rating_asc: { column: "rating", ascending: true },
  status: { column: "status", ascending: true },
};

const staffSortOptions: Record<string, SortSpec> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "full_name", ascending: true },
  name_desc: { column: "full_name", ascending: false },
  email_asc: { column: "email", ascending: true },
  email_desc: { column: "email", ascending: false },
  status: { column: "status", ascending: true },
};

export async function listEnquiries(filters?: {
  q?: string;
  status?: string;
  type?: string;
  source?: string;
  interest?: string;
  sort?: string;
}): Promise<EnquiryRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  const sort = resolveSort(filters?.sort, enquirySortOptions, enquirySortOptions.newest);
  let query = supabase.from("enquiries").select("*");

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.interest) query = query.eq("interest", filters.interest);

  const q = sanitizeSearch(filters?.q);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,company_name.ilike.%${q}%,email.ilike.%${q}%,telephone.ilike.%${q}%`,
    );
  }

  const { data } = await query.order(sort.column, { ascending: sort.ascending });
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
  q?: string;
  status?: string;
  category?: string;
  rating?: string;
  sort?: string;
}): Promise<FeedbackRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  const sort = resolveSort(filters?.sort, feedbackSortOptions, feedbackSortOptions.newest);
  let query = supabase.from("feedback").select("*");

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.rating) {
    const rating = Number(filters.rating);
    if (Number.isFinite(rating)) query = query.eq("rating", rating);
  }

  const q = sanitizeSearch(filters?.q);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`,
    );
  }

  const { data } = await query.order(sort.column, { ascending: sort.ascending });
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

export async function listStaffProfiles(filters?: {
  q?: string;
  status?: string;
  role?: string;
  sort?: string;
}): Promise<StaffProfileRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  const sort = resolveSort(filters?.sort, staffSortOptions, staffSortOptions.newest);
  let query = supabase
    .from("staff_profiles")
    .select(
      "user_id, email, full_name, status, role, notify_on_enquiry, created_at",
    );

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.role) query = query.eq("role", filters.role);

  const q = sanitizeSearch(filters?.q);
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data } = await query.order(sort.column, { ascending: sort.ascending });

  return ((data || []) as StaffProfileRow[]).map((item) => ({
    ...item,
    role: item.role === "superuser" ? "superuser" : "staff",
    notify_on_enquiry: Boolean(item.notify_on_enquiry),
  }));
}
