import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InvoiceActions } from "@/components/admin/InvoiceActions";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getInvoiceById } from "@/lib/admin/invoices";
import { formatDate, formatMoney } from "@/lib/admin/format";

async function InvoiceDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const locked = invoice.status === "paid" || invoice.status === "void";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-primary-text">
              {invoice.number}
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="mt-1 text-sm text-secondary-text">
            {invoice.customer_name} · {formatMoney(invoice.total, invoice.currency)} ·{" "}
            Issued {formatDate(invoice.issue_date)}
          </p>
          {invoice.enquiry_id ? (
            <p className="mt-1 text-sm">
              <Link
                href={`/admin/enquiries/${invoice.enquiry_id}`}
                className="font-semibold text-corporate-blue hover:text-gold-dark"
              >
                Linked enquiry
              </Link>
            </p>
          ) : null}
        </div>
        <Link
          href="/admin/invoices"
          className="text-sm font-semibold text-corporate-blue hover:text-gold-dark"
        >
          Back to invoices
        </Link>
      </div>

      <InvoiceActions id={invoice.id} status={invoice.status} />

      <InvoiceForm mode="edit" invoice={invoice} locked={locked} />
    </div>
  );
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200" />
          <div className="h-64 bg-slate-100" />
        </div>
      }
    >
      <InvoiceDetailContent params={params} />
    </Suspense>
  );
}
