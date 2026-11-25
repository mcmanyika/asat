import { Suspense } from "react";
import { AdminFilterForm } from "@/components/admin/AdminFilterForm";
import { AdminPageSkeleton } from "@/components/admin/AdminBusy";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import { getFeedbackById, listFeedback } from "@/lib/admin/queries";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
  rating?: string;
  sort?: string;
  open?: string;
}>;

async function FeedbackContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const [feedback, opened] = await Promise.all([
    listFeedback({
      q: filters.q,
      status: filters.status,
      category: filters.category,
      rating: filters.rating,
      sort: filters.sort,
    }),
    filters.open ? getFeedbackById(filters.open) : Promise.resolve(null),
  ]);

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

      <AdminFilterForm resetHref="/admin/feedback" showReset={hasFilters}>
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
      </AdminFilterForm>

      <p className="text-sm text-secondary-text">
        {feedback.length}{" "}
        {feedback.length === 1 ? "response" : "responses"}
        {hasFilters ? " matching filters" : ""}
      </p>

      <FeedbackTable feedback={feedback} initialOpen={opened} />
    </div>
  );
}

export default function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <FeedbackContent searchParams={searchParams} />
    </Suspense>
  );
}
