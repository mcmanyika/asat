import Link from "next/link";
import { Suspense } from "react";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { SpeedometerGauge } from "@/components/admin/SpeedometerGauge";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getDashboardStats } from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";

async function OverviewContent() {
  const stats = await getDashboardStats();

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

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-primary-text">
              Recent enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {stats.recentEnquiries.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                No enquiries yet.
              </li>
            ) : (
              stats.recentEnquiries.map((item) => (
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
              Recent feedback
            </h2>
            <Link
              href="/admin/feedback"
              className="text-sm font-medium text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {stats.recentFeedback.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                No feedback yet.
              </li>
            ) : (
              stats.recentFeedback.map((item) => (
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

export default function AdminOverviewPage() {
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
      <OverviewContent />
    </Suspense>
  );
}
