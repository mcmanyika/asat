"use client";

import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { AdminModal } from "@/components/admin/AdminModal";
import { updateFeedbackStatus } from "@/lib/admin/actions";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { FeedbackRow } from "@/lib/admin/types";

type FeedbackDetailModalProps = {
  feedback: FeedbackRow;
  onClose: () => void;
};

export function FeedbackDetailModal({
  feedback,
  onClose,
}: FeedbackDetailModalProps) {
  return (
    <AdminModal
      eyebrow="Feedback detail"
      title={feedback.full_name || "Anonymous feedback"}
      subtitle={`${formatLabel(feedback.category)} · ${formatDateTime(feedback.created_at)}`}
      onClose={onClose}
      size="lg"
      labelledBy="feedback-modal-title"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={feedback.status} />
            <StatusSelect
              id={feedback.id}
              status={feedback.status}
              action={updateFeedbackStatus}
              options={[
                { value: "new", label: "New" },
                { value: "reviewed", label: "Reviewed" },
                { value: "closed", label: "Closed" },
              ]}
            />
          </div>

          <h3 className="text-sm font-semibold text-primary-text">Details</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-secondary-text">Rating</dt>
              <dd className="font-medium text-primary-text">
                {feedback.rating ? `${feedback.rating} / 5` : "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-secondary-text">Email</dt>
              <dd className="font-medium text-primary-text">
                {feedback.email ? (
                  <a
                    href={`mailto:${feedback.email}`}
                    className="text-gold-dark hover:underline"
                  >
                    {feedback.email}
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-secondary-text">Source</dt>
              <dd className="font-medium text-primary-text">
                {formatLabel(feedback.source)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-primary-text">Message</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-secondary-text">
            {feedback.message}
          </p>
        </section>
      </div>
    </AdminModal>
  );
}
