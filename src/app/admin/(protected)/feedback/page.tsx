import Link from "next/link";
import { Suspense } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateFeedbackStatus } from "@/lib/admin/actions";
import { listFeedback } from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";

type SearchParams = Promise<{
  status?: string;
  category?: string;
}>;

async function FeedbackContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const feedback = await listFeedback({
    status: filters.status,
    category: filters.category,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Feedback</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Review visitor feedback captured through the chat assistant.
        </p>
      </div>

      <form
        method="get"
        className="flex flex-wrap gap-3 border border-border bg-white p-4 shadow-sm"
      >
        <select
          name="status"
          defaultValue={filters.status || ""}
          className="rounded-[4px] border border-border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="closed">Closed</option>
        </select>
        <select
          name="category"
          defaultValue={filters.category || ""}
          className="rounded-[4px] border border-border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          <option value="website">Website</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="chat">Chat</option>
          <option value="general">General</option>
        </select>
        <button
          type="submit"
          className="bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Filter
        </button>
        <Link
          href="/admin/feedback"
          className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
        >
          Reset
        </Link>
      </form>

      <div className="overflow-x-auto border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-light-bg text-xs tracking-wide text-secondary-text uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Visitor</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {feedback.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-secondary-text"
                >
                  No feedback match these filters.
                </td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr key={item.id} className="align-top hover:bg-light-bg/70">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/feedback/${item.id}`}
                      className="font-medium text-primary-text hover:underline"
                    >
                      {item.full_name || "Anonymous"}
                    </Link>
                    {item.email ? (
                      <p className="text-xs text-secondary-text">{item.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{formatLabel(item.category)}</td>
                  <td className="px-4 py-3">
                    {item.rating ? `${item.rating}/5` : "—"}
                  </td>
                  <td className="max-w-sm px-4 py-3">
                    <p className="line-clamp-2 text-secondary-text">
                      {item.message}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={item.status} />
                      <StatusSelect
                        id={item.id}
                        status={item.status}
                        action={updateFeedbackStatus}
                        options={[
                          { value: "new", label: "New" },
                          { value: "reviewed", label: "Reviewed" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-slate-200" />
          <div className="h-48 bg-slate-100" />
        </div>
      }
    >
      <FeedbackContent searchParams={searchParams} />
    </Suspense>
  );
}
