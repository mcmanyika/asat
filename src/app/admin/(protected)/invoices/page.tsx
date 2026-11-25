import Link from "next/link";
import { Suspense } from "react";
import { InvoicesTable } from "@/components/admin/InvoicesTable";
import { listInvoices } from "@/lib/admin/invoices";

type SearchParams = Promise<{ status?: string }>;

async function InvoicesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const invoices = await listInvoices({
    status: filters.status,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Invoices</h1>
          <p className="mt-1 text-sm text-secondary-text">
            Create, send and track customer invoices.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a]"
        >
          New invoice
        </Link>
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
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="void">Void</option>
        </select>
        <button
          type="submit"
          className="bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Filter
        </button>
        <Link
          href="/admin/invoices"
          className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text"
        >
          Reset
        </Link>
      </form>

      <InvoicesTable invoices={invoices} />
    </div>
  );
}

export default function AdminInvoicesPage({
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
      <InvoicesContent searchParams={searchParams} />
    </Suspense>
  );
}
