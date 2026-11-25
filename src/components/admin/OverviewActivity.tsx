"use client";

import { useState } from "react";
import Link from "next/link";
import { EnquiryDetailModal } from "@/components/admin/EnquiryDetailModal";
import { FeedbackDetailModal } from "@/components/admin/FeedbackDetailModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { EnquiryRow, FeedbackRow } from "@/lib/admin/types";

type OverviewActivityProps = {
  enquiries: EnquiryRow[];
  feedback: FeedbackRow[];
  enquiriesHref: string;
  feedbackHref: string;
  hasFilters: boolean;
  enquiryTotal: number;
  feedbackTotal: number;
};

export function OverviewActivity({
  enquiries,
  feedback,
  enquiriesHref,
  feedbackHref,
  hasFilters,
  enquiryTotal,
  feedbackTotal,
}: OverviewActivityProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRow | null>(
    null,
  );
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(
    null,
  );

  return (
    <>
      {hasFilters ? (
        <p className="text-sm text-secondary-text">
          Showing {enquiries.length} of {enquiryTotal} enquiries ·{" "}
          {feedback.length} of {feedbackTotal} feedback
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
            {enquiries.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                {hasFilters
                  ? "No enquiries match these filters."
                  : "No enquiries yet."}
              </li>
            ) : (
              enquiries.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(item)}
                    className="block w-full px-4 py-3 text-left transition hover:bg-light-bg"
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
                  </button>
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
            {feedback.length === 0 ? (
              <li className="px-4 py-6 text-sm text-secondary-text">
                {hasFilters
                  ? "No feedback match these filters."
                  : "No feedback yet."}
              </li>
            ) : (
              feedback.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedFeedback(item)}
                    className="block w-full px-4 py-3 text-left transition hover:bg-light-bg"
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
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

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
