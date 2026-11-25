import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateFeedbackStatus } from "@/lib/admin/actions";
import { getFeedbackById } from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";

async function FeedbackDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const feedback = await getFeedbackById(id);
  if (!feedback) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/feedback"
            className="text-sm text-secondary-text hover:text-primary-text"
          >
            ← Back to feedback
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-primary-text">
            {feedback.full_name || "Anonymous feedback"}
          </h1>
          <p className="mt-1 text-sm text-secondary-text">
            {formatLabel(feedback.category)} ·{" "}
            {formatDateTime(feedback.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="border border-border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-primary-text">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
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

        <section className="border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-primary-text">Message</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-secondary-text">
            {feedback.message}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function AdminFeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-slate-200" />
          <div className="h-40 bg-slate-100" />
        </div>
      }
    >
      <FeedbackDetail params={params} />
    </Suspense>
  );
}
