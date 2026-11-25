import Link from "next/link";
import { Suspense } from "react";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { listEnquiries } from "@/lib/admin/queries";
import { interestLabels } from "@/lib/validations/enquiry";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  type?: string;
  source?: string;
  interest?: string;
  sort?: string;
}>;

async function EnquiriesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const enquiries = await listEnquiries({
    q: filters.q,
    status: filters.status,
    type: filters.type,
    source: filters.source,
    interest: filters.interest,
    sort: filters.sort,
  });

  const hasFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.type ||
      filters.source ||
      filters.interest ||
      (filters.sort && filters.sort !== "newest"),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Enquiries</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Review and update website and chatbot enquiry submissions.
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
            placeholder="Name, company, email, phone"
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
            defaultValue={filters.sort || "newest"}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="company_asc">Company A–Z</option>
            <option value="company_desc">Company Z–A</option>
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
            href="/admin/enquiries"
            className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
          >
            Reset
          </Link>
        ) : null}
      </form>

      <p className="text-sm text-secondary-text">
        {enquiries.length}{" "}
        {enquiries.length === 1 ? "enquiry" : "enquiries"}
        {hasFilters ? " matching filters" : ""}
      </p>

      <EnquiriesTable enquiries={enquiries} />
    </div>
  );
}

export default function AdminEnquiriesPage({
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
      <EnquiriesContent searchParams={searchParams} />
    </Suspense>
  );
}
