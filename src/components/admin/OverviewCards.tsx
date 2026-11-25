"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminModal } from "@/components/admin/AdminModal";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { EnquiryDetailModal } from "@/components/admin/EnquiryDetailModal";
import { FeedbackDetailModal } from "@/components/admin/FeedbackDetailModal";
import { SpeedometerGauge } from "@/components/admin/SpeedometerGauge";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type {
  DashboardStats,
  EnquiryRow,
  FeedbackRow,
} from "@/lib/admin/types";

type MetricKey =
  | "new-enquiries"
  | "open-workload"
  | "all-enquiries"
  | "in-progress"
  | "new-feedback"
  | "all-feedback"
  | "avg-rating"
  | "by-type"
  | "by-interest"
  | "by-source";

type OverviewCardsProps = {
  stats: DashboardStats;
};

function ratingBuckets(feedback: FeedbackRow[]) {
  const buckets = [5, 4, 3, 2, 1].map((rating) => ({
    label: `${rating}`,
    count: feedback.filter((item) => item.rating === rating).length,
  }));
  return buckets.filter((item) => item.count > 0);
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const [metric, setMetric] = useState<MetricKey | null>(null);
  const [breakdownValue, setBreakdownValue] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRow | null>(
    null,
  );
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(
    null,
  );

  const enquiryWorkload =
    stats.enquiriesNew + stats.enquiriesInProgress + stats.enquiriesClosed;
  const openEnquiries = stats.enquiriesNew + stats.enquiriesInProgress;

  const detail = useMemo(() => {
    if (!metric) return null;

    if (metric === "new-enquiries") {
      const rows = stats.allEnquiries.filter((item) => item.status === "new");
      return {
        title: "New enquiries",
        subtitle: `${rows.length} waiting for review`,
        kind: "enquiries" as const,
        rows,
        href: "/admin/enquiries?status=new",
      };
    }

    if (metric === "open-workload" || metric === "in-progress") {
      const filtered =
        metric === "in-progress"
          ? stats.allEnquiries.filter((item) => item.status === "in_progress")
          : stats.allEnquiries.filter(
              (item) =>
                item.status === "new" || item.status === "in_progress",
            );
      return {
        title: metric === "in-progress" ? "In progress" : "Open workload",
        subtitle: `${filtered.length} open enquiries`,
        kind: "enquiries" as const,
        rows: filtered,
        href:
          metric === "in-progress"
            ? "/admin/enquiries?status=in_progress"
            : "/admin/enquiries?status=new",
      };
    }

    if (metric === "all-enquiries") {
      return {
        title: "All enquiries",
        subtitle: `${stats.allEnquiries.length} total`,
        kind: "enquiries" as const,
        rows: stats.allEnquiries,
        href: "/admin/enquiries",
      };
    }

    if (metric === "new-feedback") {
      const rows = stats.allFeedback.filter((item) => item.status === "new");
      return {
        title: "New feedback",
        subtitle: `${rows.length} unread responses`,
        kind: "feedback" as const,
        rows,
        href: "/admin/feedback?status=new",
      };
    }

    if (metric === "all-feedback") {
      return {
        title: "All feedback",
        subtitle: `${stats.allFeedback.length} total`,
        kind: "feedback" as const,
        rows: stats.allFeedback,
        href: "/admin/feedback",
      };
    }

    if (metric === "avg-rating") {
      const rated = stats.allFeedback.filter(
        (item) => typeof item.rating === "number",
      );
      return {
        title: "Average rating",
        subtitle:
          stats.feedbackAvgRating != null
            ? `${stats.feedbackAvgRating.toFixed(1)} / 5 from ${rated.length} ratings`
            : "No ratings yet",
        kind: "feedback" as const,
        rows: rated,
        href: "/admin/feedback",
        ratingBreakdown: ratingBuckets(stats.allFeedback),
      };
    }

    if (metric === "by-type") {
      const rows = breakdownValue
        ? stats.allEnquiries.filter((item) => item.type === breakdownValue)
        : stats.allEnquiries;
      return {
        title: "By enquiry type",
        subtitle: breakdownValue
          ? `${formatLabel(breakdownValue)} · ${rows.length}`
          : `${stats.allEnquiries.length} enquiries`,
        kind: "enquiries" as const,
        rows,
        href: breakdownValue
          ? `/admin/enquiries?type=${encodeURIComponent(breakdownValue)}`
          : "/admin/enquiries",
        breakdown: stats.enquiriesByType,
        breakdownKey: "type" as const,
      };
    }

    if (metric === "by-interest") {
      const rows = breakdownValue
        ? stats.allEnquiries.filter((item) => item.interest === breakdownValue)
        : stats.allEnquiries;
      return {
        title: "By interest area",
        subtitle: breakdownValue
          ? `${formatLabel(breakdownValue)} · ${rows.length}`
          : `${stats.allEnquiries.length} enquiries`,
        kind: "enquiries" as const,
        rows,
        href: breakdownValue
          ? `/admin/enquiries?interest=${encodeURIComponent(breakdownValue)}`
          : "/admin/enquiries",
        breakdown: stats.enquiriesByInterest,
        breakdownKey: "interest" as const,
      };
    }

    if (metric === "by-source") {
      const rows = breakdownValue
        ? stats.allEnquiries.filter(
            (item) => (item.source || "website") === breakdownValue,
          )
        : stats.allEnquiries;
      return {
        title: "By source",
        subtitle: breakdownValue
          ? `${formatLabel(breakdownValue)} · ${rows.length}`
          : `${stats.allEnquiries.length} enquiries`,
        kind: "enquiries" as const,
        rows,
        href: breakdownValue
          ? `/admin/enquiries?source=${encodeURIComponent(breakdownValue)}`
          : "/admin/enquiries",
        breakdown: stats.enquiriesBySource,
        breakdownKey: "source" as const,
      };
    }

    return null;
  }, [metric, breakdownValue, stats]);

  function openMetric(next: MetricKey, value?: string) {
    setMetric(next);
    setBreakdownValue(value ?? null);
  }

  function closeMetric() {
    setMetric(null);
    setBreakdownValue(null);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SpeedometerGauge
          label="New enquiries"
          value={stats.enquiriesNew}
          max={Math.max(stats.enquiriesTotal, 1)}
          hint={`${stats.enquiriesNew} of ${stats.enquiriesTotal} total`}
          tone="gold"
          onClick={() => openMetric("new-enquiries")}
        />
        <SpeedometerGauge
          label="Open workload"
          value={openEnquiries}
          max={Math.max(enquiryWorkload, 1)}
          displayValue={openEnquiries}
          hint={`${stats.enquiriesInProgress} in progress · ${stats.enquiriesClosed} closed`}
          tone="cyan"
          onClick={() => openMetric("open-workload")}
        />
        <SpeedometerGauge
          label="New feedback"
          value={stats.feedbackNew}
          max={Math.max(stats.feedbackTotal, 1)}
          hint={`${stats.feedbackNew} of ${stats.feedbackTotal} total`}
          tone="navy"
          onClick={() => openMetric("new-feedback")}
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
          onClick={() => openMetric("avg-rating")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Enquiries"
          value={stats.enquiriesTotal}
          hint={`${stats.enquiriesNew} new`}
          onClick={() => openMetric("all-enquiries")}
        />
        <StatCard
          label="In progress"
          value={stats.enquiriesInProgress}
          hint={`${stats.enquiriesClosed} closed`}
          onClick={() => openMetric("in-progress")}
        />
        <StatCard
          label="Feedback"
          value={stats.feedbackTotal}
          hint={`${stats.feedbackNew} new`}
          onClick={() => openMetric("all-feedback")}
        />
        <StatCard
          label="Avg rating"
          value={stats.feedbackAvgRating ?? "—"}
          hint="From rated feedback"
          onClick={() => openMetric("avg-rating")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownList
          title="By enquiry type"
          items={stats.enquiriesByType}
          onOpen={() => openMetric("by-type")}
          onItemOpen={(label) => openMetric("by-type", label)}
        />
        <BreakdownList
          title="By interest area"
          items={stats.enquiriesByInterest}
          onOpen={() => openMetric("by-interest")}
          onItemOpen={(label) => openMetric("by-interest", label)}
        />
        <BreakdownList
          title="By source"
          items={stats.enquiriesBySource}
          onOpen={() => openMetric("by-source")}
          onItemOpen={(label) => openMetric("by-source", label)}
        />
      </div>

      {detail ? (
        <AdminModal
          eyebrow="Overview detail"
          title={detail.title}
          subtitle={detail.subtitle}
          onClose={closeMetric}
          size="xl"
          labelledBy="overview-metric-title"
          footer={
            <div className="flex flex-wrap gap-3">
              <Link
                href={detail.href}
                className="inline-flex items-center justify-center bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15233a]"
              >
                Open full list
              </Link>
              {breakdownValue ? (
                <button
                  type="button"
                  onClick={() => setBreakdownValue(null)}
                  className="inline-flex items-center justify-center border border-border bg-white px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-light-bg"
                >
                  Clear category filter
                </button>
              ) : null}
            </div>
          }
        >
          <div className="space-y-5">
            {"breakdown" in detail && detail.breakdown ? (
              <div className="flex flex-wrap gap-2">
                {detail.breakdown.map((item) => {
                  const active = breakdownValue === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        setBreakdownValue(active ? null : item.label)
                      }
                      className={
                        active
                          ? "border border-navy bg-navy px-3 py-1.5 text-sm font-medium text-white"
                          : "border border-border bg-white px-3 py-1.5 text-sm font-medium text-primary-text hover:bg-light-bg"
                      }
                    >
                      {formatLabel(item.label)} ({item.count})
                    </button>
                  );
                })}
              </div>
            ) : null}

            {"ratingBreakdown" in detail && detail.ratingBreakdown?.length ? (
              <div className="grid gap-2 sm:grid-cols-5">
                {detail.ratingBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="border border-border bg-light-bg px-3 py-2 text-center"
                  >
                    <p className="text-lg font-bold text-primary-text">
                      {item.count}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {item.label}★
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {detail.kind === "enquiries" ? (
              <ul className="divide-y divide-border border border-border">
                {detail.rows.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-secondary-text">
                    No enquiries in this view.
                  </li>
                ) : (
                  detail.rows.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(item)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-light-bg"
                      >
                        <div>
                          <p className="font-medium text-primary-text">
                            {item.full_name}
                          </p>
                          <p className="text-sm text-secondary-text">
                            {formatLabel(item.type)} · {item.company_name} ·{" "}
                            {formatLabel(item.interest)}
                          </p>
                          <p className="mt-1 text-xs text-secondary-text">
                            {formatDateTime(item.created_at)} ·{" "}
                            {formatLabel(item.source)}
                          </p>
                        </div>
                        <StatusBadge status={item.status} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <ul className="divide-y divide-border border border-border">
                {detail.rows.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-secondary-text">
                    No feedback in this view.
                  </li>
                ) : (
                  detail.rows.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedFeedback(item)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-light-bg"
                      >
                        <div>
                          <p className="font-medium text-primary-text">
                            {item.full_name || "Anonymous"}
                            {item.rating ? ` · ${item.rating}/5` : ""}
                          </p>
                          <p className="line-clamp-2 text-sm text-secondary-text">
                            {item.message}
                          </p>
                          <p className="mt-1 text-xs text-secondary-text">
                            {formatDateTime(item.created_at)} ·{" "}
                            {formatLabel(item.category)}
                          </p>
                        </div>
                        <StatusBadge status={item.status} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </AdminModal>
      ) : null}

      {selectedEnquiry ? (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
        />
      ) : null}

      {selectedFeedback ? (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      ) : null}
    </>
  );
}
