import Link from "next/link";
import { Suspense } from "react";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { SpeedometerGauge } from "@/components/admin/SpeedometerGauge";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  getDashboardStats,
  listEnquiries,
  listFeedback,
} from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
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

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 border border-border bg-white p-4 shadow-sm"
      >
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
        <button
          type="submit"
          className="bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Apply
        </button>
        {hasFilters ? (
          <Link
            href="/admin"
            className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
          >
            Reset
          </Link>
        ) : null}
      </form>

      {hasFilters ? (
        <p className="text-sm text-secondary-text">
          Showing {recentEnquiries.length} of {enquiries.length} enquiries ·{" "}
          {recentFeedback.length} of {feedback.length} feedback
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-primary-text">
              {hasFilters ? "Matching enquiries" : "Recent enquiries"}
            </h2>
            <Link
              href={enquiriesHref}
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentEnquiries.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                {hasFilters
                  ? "No enquiries match these filters."
                  : "No enquiries yet."}
              </li>
            ) : (
              recentEnquiries.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/enquiries/${item.id}`}
                    className="block px-4 py-3 transition hover:bg-light-bg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-primary-text">
                          {item.full_name}
                        </p>
                        <p className="text-sm text-secondary-text">
                          {formatLabel(item.type)} · {item.company_name}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-xs text-secondary-text">
                      {formatDateTime(item.created_at)}
                    </p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-primary-text">
              {hasFilters ? "Matching feedback" : "Recent feedback"}
            </h2>
            <Link
              href={feedbackHref}
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentFeedback.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                {hasFilters
                  ? "No feedback match these filters."
                  : "No feedback yet."}
              </li>
            ) : (
              recentFeedback.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/feedback/${item.id}`}
                    className="block px-4 py-3 transition hover:bg-light-bg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-primary-text">
                          {item.full_name || "Anonymous"}
                          {item.rating ? ` · ${item.rating}/5` : ""}
                        </p>
                        <p className="line-clamp-2 text-sm text-secondary-text">
                          {item.message}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-xs text-secondary-text">
                      {formatDateTime(item.created_at)}
                    </p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function AdminOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-40 bg-slate-100" />
            <div className="h-40 bg-slate-100" />
            <div className="h-40 bg-slate-100" />
            <div className="h-40 bg-slate-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-24 bg-slate-100" />
            <div className="h-24 bg-slate-100" />
            <div className="h-24 bg-slate-100" />
            <div className="h-24 bg-slate-100" />
          </div>
        </div>
      }
    >
      <OverviewContent searchParams={searchParams} />
    </Suspense>
  );
}
