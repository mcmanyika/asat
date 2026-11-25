import { Suspense } from "react";
import { AdminFilterForm } from "@/components/admin/AdminFilterForm";
import { AdminPageSkeleton } from "@/components/admin/AdminBusy";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { OverviewActivity } from "@/components/admin/OverviewActivity";
import { SpeedometerGauge } from "@/components/admin/SpeedometerGauge";
import { StatCard } from "@/components/admin/StatCard";
import {
  getDashboardStats,
  listEnquiries,
  listFeedback,
} from "@/lib/admin/queries";
import { interestLabels } from "@/lib/validations/enquiry";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  type?: string;
  source?: string;
  interest?: string;
  sort?: string;
}>;

function buildQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function OverviewContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const sort = filters.sort || "newest";

  const enquiryStatus =
    filters.status === "new" ||
    filters.status === "in_progress" ||
    filters.status === "closed"
      ? filters.status
      : undefined;
  const feedbackStatus =
    filters.status === "new" ||
    filters.status === "reviewed" ||
    filters.status === "closed"
      ? filters.status
      : undefined;

  const [stats, enquiries, feedback] = await Promise.all([
    getDashboardStats(),
    listEnquiries({
      q: filters.q,
      status: enquiryStatus,
      type: filters.type,
      source: filters.source,
      interest: filters.interest,
      sort,
    }),
    listFeedback({
      q: filters.q,
      status: feedbackStatus,
      sort,
    }),
  ]);

  if (!stats) {
    return (
      <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Unable to load dashboard data. Check Supabase configuration and staff
        permissions (`supabase/staff-dashboard.sql`).
      </div>
    );
  }

  const enquiryWorkload =
    stats.enquiriesNew + stats.enquiriesInProgress + stats.enquiriesClosed;
  const openEnquiries = stats.enquiriesNew + stats.enquiriesInProgress;

  const hasFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.type ||
      filters.source ||
      filters.interest ||
      (filters.sort && filters.sort !== "newest"),
  );

  const recentEnquiries = enquiries.slice(0, 12);
  const recentFeedback = feedback.slice(0, 12);

  const enquiriesHref = `/admin/enquiries${buildQuery({
    q: filters.q,
    status: enquiryStatus,
    type: filters.type,
    source: filters.source,
    interest: filters.interest,
    sort: filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
  })}`;

  const feedbackHref = `/admin/feedback${buildQuery({
    q: filters.q,
    status: feedbackStatus,
    sort: filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
  })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Overview</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Enquiry and feedback activity from the website and chat assistant.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SpeedometerGauge
          label="New enquiries"
          value={stats.enquiriesNew}
          max={Math.max(stats.enquiriesTotal, 1)}
          hint={`${stats.enquiriesNew} of ${stats.enquiriesTotal} total`}
          tone="gold"
        />
        <SpeedometerGauge
          label="Open workload"
          value={openEnquiries}
          max={Math.max(enquiryWorkload, 1)}
          displayValue={openEnquiries}
          hint={`${stats.enquiriesInProgress} in progress · ${stats.enquiriesClosed} closed`}
          tone="cyan"
        />
        <SpeedometerGauge
          label="New feedback"
          value={stats.feedbackNew}
          max={Math.max(stats.feedbackTotal, 1)}
          hint={`${stats.feedbackNew} of ${stats.feedbackTotal} total`}
          tone="navy"
        />
        <SpeedometerGauge
          label="Avg rating"
          value={stats.feedbackAvgRating ?? 0}
          max={5}
          displayValue={
            stats.feedbackAvgRating != null
              ? stats.feedbackAvgRating.toFixed(1)
              : "—"
          }
          hint="Out of 5 from rated feedback"
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Enquiries"
          value={stats.enquiriesTotal}
          hint={`${stats.enquiriesNew} new`}
        />
        <StatCard
          label="In progress"
          value={stats.enquiriesInProgress}
          hint={`${stats.enquiriesClosed} closed`}
        />
        <StatCard
          label="Feedback"
          value={stats.feedbackTotal}
          hint={`${stats.feedbackNew} new`}
        />
        <StatCard
          label="Avg rating"
          value={stats.feedbackAvgRating ?? "—"}
          hint="From rated feedback"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownList title="By enquiry type" items={stats.enquiriesByType} />
        <BreakdownList
          title="By interest area"
          items={stats.enquiriesByInterest}
        />
        <BreakdownList title="By source" items={stats.enquiriesBySource} />
      </div>

      <AdminFilterForm resetHref="/admin" showReset={hasFilters}>
        <label className="min-w-[12rem] flex-1 space-y-1">
          <span className="text-xs font-medium text-secondary-text">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q || ""}
            placeholder="Name, company, email, message"
            className="w-full rounded-[4px] border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Status</span>
          <select
            name="status"
            defaultValue={filters.status || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="reviewed">Reviewed</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Type</span>
          <select
            name="type"
            defaultValue={filters.type || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="contact">Contact</option>
            <option value="quote">Quote</option>
            <option value="demo">Demo</option>
            <option value="consultation">Consultation</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">
            Interest
          </span>
          <select
            name="interest"
            defaultValue={filters.interest || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All interests</option>
            {Object.entries(interestLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Source</span>
          <select
            name="source"
            defaultValue={filters.source || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All sources</option>
            <option value="website">Website</option>
            <option value="chatbot">Chatbot</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="status">Status</option>
          </select>
        </label>
      </AdminFilterForm>

      <OverviewActivity
        enquiries={recentEnquiries}
        feedback={recentFeedback}
        enquiriesHref={enquiriesHref}
        feedbackHref={feedbackHref}
        hasFilters={hasFilters}
        enquiryTotal={enquiries.length}
        feedbackTotal={feedback.length}
      />
    </div>
  );
}

export default function AdminOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <OverviewContent searchParams={searchParams} />
    </Suspense>
  );
}
