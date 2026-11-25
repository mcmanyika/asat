"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  emailInvoice,
  updateInvoiceStatus,
} from "@/lib/admin/invoice-actions";
import type { InvoiceStatus } from "@/lib/admin/types";
import { StatusSelect } from "@/components/admin/StatusSelect";

type InvoiceActionsProps = {
  id: string;
  status: InvoiceStatus;
};

export function InvoiceActions({ id, status }: InvoiceActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function sendEmail() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("id", id);
        const result = await emailInvoice(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setMessage("Invoice emailed to the customer.");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to email invoice.",
        );
      }
    });
  }

  return (
    <div className="space-y-3 border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <StatusSelect
          id={id}
          status={status}
          action={updateInvoiceStatus}
          options={[
            { value: "draft", label: "Draft" },
            { value: "sent", label: "Sent" },
            { value: "paid", label: "Paid" },
            { value: "void", label: "Void" },
          ]}
        />
        <Link
          href={`/admin/invoices/${id}/pdf`}
          className="inline-flex items-center justify-center border border-border px-3 py-2 text-sm font-semibold text-primary-text transition hover:bg-light-bg"
        >
          Download PDF
        </Link>
        <button
          type="button"
          disabled={pending || status === "void"}
          onClick={sendEmail}
          className="inline-flex items-center justify-center bg-navy px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Email customer"}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-amber-800">{error}</p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-800">{message}</p>
      ) : null}
    </div>
  );
}
