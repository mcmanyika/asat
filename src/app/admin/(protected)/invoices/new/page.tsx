import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { InvoiceFormFromEnquiry } from "@/components/admin/InvoiceFormFromEnquiry";

type SearchParams = Promise<{
  enquiryId?: string;
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
}>;

async function NewInvoiceContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">New invoice</h1>
          <p className="mt-1 text-sm text-secondary-text">
            Draft an invoice for a customer. You can email the PDF after saving.
          </p>
        </div>
        <Link
          href="/admin/invoices"
          className="text-sm font-semibold text-corporate-blue hover:text-gold-dark"
        >
          Back to invoices
        </Link>
      </div>

      <InvoiceFormFromEnquiry
        enquiryId={params.enquiryId || null}
        defaults={{
          customer_name: params.name || "",
          customer_email: params.email || "",
          customer_company: params.company || "",
          customer_phone: params.phone || "",
        }}
      />
    </div>
  );
}

export default function NewInvoicePage({
  searchParams,
}: {
  searchParams: SearchParams;
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
      <NewInvoiceContent searchParams={searchParams} />
    </Suspense>
  );
}
