import Link from "next/link";
import { Suspense } from "react";
import { AdminFilterForm } from "@/components/admin/AdminFilterForm";
import { AdminPageSkeleton } from "@/components/admin/AdminBusy";
import { InvoicesTable } from "@/components/admin/InvoicesTable";
import { getInvoiceById, listInvoices } from "@/lib/admin/invoices";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  sort?: string;
  open?: string;
}>;

async function InvoicesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const [invoices, opened] = await Promise.all([
    listInvoices({
      q: filters.q,
      status: filters.status,
      sort: filters.sort,
    }),
    filters.open ? getInvoiceById(filters.open) : Promise.resolve(null),
  ]);

  const hasFilters = Boolean(
    filters.q ||
      filters.status ||
      (filters.sort && filters.sort !== "newest"),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Invoices</h1>
          <p className="mt-1 text-sm text-secondary-text">
            Create, send and track customer invoices. Click a row for a quick
            preview; open the full form to edit line items.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a]"
        >
          New invoice
        </Link>
      </div>

      <AdminFilterForm resetHref="/admin/invoices" showReset={hasFilters}>
        <label className="min-w-[12rem] flex-1 space-y-1">
          <span className="text-xs font-medium text-secondary-text">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q || ""}
            placeholder="Number, customer, email, company"
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="void">Void</option>
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
            <option value="number_asc">Number A–Z</option>
            <option value="number_desc">Number Z–A</option>
            <option value="customer_asc">Customer A–Z</option>
            <option value="customer_desc">Customer Z–A</option>
            <option value="issue_newest">Issue date newest</option>
            <option value="issue_oldest">Issue date oldest</option>
            <option value="total_desc">Highest total</option>
            <option value="total_asc">Lowest total</option>
            <option value="status">Status</option>
          </select>
        </label>
      </AdminFilterForm>

      <p className="text-sm text-secondary-text">
        {invoices.length}{" "}
        {invoices.length === 1 ? "invoice" : "invoices"}
        {hasFilters ? " matching filters" : ""}
      </p>

      <InvoicesTable invoices={invoices} initialOpen={opened} />
    </div>
  );
}

export default function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <InvoicesContent searchParams={searchParams} />
    </Suspense>
  );
}
