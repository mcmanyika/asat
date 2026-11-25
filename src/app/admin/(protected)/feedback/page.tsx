import Link from "next/link";
import { Suspense } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateFeedbackStatus } from "@/lib/admin/actions";
import { listFeedback } from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
  rating?: string;
  sort?: string;
}>;

async function FeedbackContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const feedback = await listFeedback({
    q: filters.q,
    status: filters.status,
    category: filters.category,
    rating: filters.rating,
    sort: filters.sort,
  });

  const hasFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.category ||
      filters.rating ||
      (filters.sort && filters.sort !== "newest"),
  );

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
        className="flex flex-wrap items-end gap-3 border border-border bg-white p-4 shadow-sm"
      >
        <label className="min-w-[12rem] flex-1 space-y-1">
          <span className="text-xs font-medium text-secondary-text">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q || ""}
            placeholder="Name, email, or message"
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
            <option value="reviewed">Reviewed</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">
            Category
          </span>
          <select
            name="category"
            defaultValue={filters.category || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            <option value="website">Website</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="chat">Chat</option>
            <option value="general">General</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Rating</span>
          <select
            name="rating"
            defaultValue={filters.rating || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Sort</span>
          <select
            name="sort"
            defaultValue={filters.sort || "newest"}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="rating_desc">Highest rating</option>
            <option value="rating_asc">Lowest rating</option>
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
            href="/admin/feedback"
            className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
          >
            Reset
          </Link>
        ) : null}
      </form>

      <p className="text-sm text-secondary-text">
        {feedback.length}{" "}
        {feedback.length === 1 ? "response" : "responses"}
        {hasFilters ? " matching filters" : ""}
      </p>

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
