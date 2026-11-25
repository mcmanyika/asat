import Link from "next/link";
import { Suspense } from "react";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { listEnquiries } from "@/lib/admin/queries";

type SearchParams = Promise<{
  status?: string;
  type?: string;
  source?: string;
}>;

async function EnquiriesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const enquiries = await listEnquiries({
    status: filters.status,
    type: filters.type,
    source: filters.source,
  });

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
        className="flex flex-wrap gap-3 border border-border bg-white p-4 shadow-sm"
      >
        <select
          name="status"
          defaultValue={filters.status || ""}
          className="rounded-[4px] border border-border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="closed">Closed</option>
        </select>
        <select
          name="type"
          defaultValue={filters.type || ""}
          className="rounded-[4px] border border-border px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="contact">Contact</option>
          <option value="quote">Quote</option>
          <option value="demo">Demo</option>
          <option value="consultation">Consultation</option>
        </select>
        <select
          name="source"
          defaultValue={filters.source || ""}
          className="rounded-[4px] border border-border px-3 py-2 text-sm"
        >
          <option value="">All sources</option>
          <option value="website">Website</option>
          <option value="chatbot">Chatbot</option>
        </select>
        <button
          type="submit"
          className="bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Filter
        </button>
        <Link
          href="/admin/enquiries"
          className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
        >
          Reset
        </Link>
      </form>

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
