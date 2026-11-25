"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminModal } from "@/components/admin/AdminModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import {
  emailInvoice,
  updateInvoiceStatus,
} from "@/lib/admin/invoice-actions";
import { formatDate, formatMoney } from "@/lib/admin/format";
import type { InvoiceRow } from "@/lib/admin/types";

type InvoicePreviewModalProps = {
  invoice: InvoiceRow;
  onClose: () => void;
};

export function InvoicePreviewModal({
  invoice,
  onClose,
}: InvoicePreviewModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function sendEmail() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("id", invoice.id);
        const result = await emailInvoice(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setMessage("Invoice emailed to the customer.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to email invoice.",
        );
      }
    });
  }

  return (
    <AdminModal
      eyebrow="Invoice"
      title={invoice.number}
      subtitle={`${invoice.customer_name} · ${formatDate(invoice.issue_date)}`}
      onClose={onClose}
      size="lg"
      labelledBy="invoice-preview-title"
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(`/admin/invoices/${invoice.id}`);
            }}
            className="inline-flex items-center justify-center bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15233a]"
          >
            Open full invoice
          </button>
          <Link
            href={`/admin/invoices/${invoice.id}/pdf`}
            className="inline-flex items-center justify-center border border-border bg-white px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-light-bg"
          >
            Download PDF
          </Link>
          <button
            type="button"
            disabled={pending || invoice.status === "void"}
            onClick={sendEmail}
            className="inline-flex items-center justify-center border border-border bg-white px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-light-bg disabled:opacity-60"
          >
            {pending ? "Sending…" : "Email customer"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={invoice.status} />
          <StatusSelect
            id={invoice.id}
            status={invoice.status}
            action={updateInvoiceStatus}
            options={[
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "paid", label: "Paid" },
              { value: "void", label: "Void" },
            ]}
          />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Customer
            </dt>
            <dd className="mt-1 text-sm font-medium text-primary-text">
              {invoice.customer_name}
            </dd>
            <dd className="text-sm text-secondary-text">
              {invoice.customer_email}
            </dd>
            {invoice.customer_company ? (
              <dd className="text-sm text-secondary-text">
                {invoice.customer_company}
              </dd>
            ) : null}
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Dates
            </dt>
            <dd className="mt-1 text-sm text-primary-text">
              Issued {formatDate(invoice.issue_date)}
            </dd>
            <dd className="text-sm text-secondary-text">
              Due {invoice.due_date ? formatDate(invoice.due_date) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Subtotal
            </dt>
            <dd className="mt-1 text-sm font-medium text-primary-text">
              {formatMoney(invoice.subtotal, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Total
            </dt>
            <dd className="mt-1 text-lg font-bold text-primary-text">
              {formatMoney(invoice.total, invoice.currency)}
            </dd>
            <dd className="text-xs text-secondary-text">
              Tax {formatMoney(invoice.tax_amount, invoice.currency)} (
              {invoice.tax_rate}%)
            </dd>
          </div>
        </dl>

        {invoice.notes ? (
          <div>
            <h3 className="text-sm font-semibold text-primary-text">Notes</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-secondary-text">
              {invoice.notes}
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {message}
          </p>
        ) : null}
      </div>
    </AdminModal>
  );
}
