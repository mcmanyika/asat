"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminBusyOverlay } from "@/components/admin/AdminBusy";
import { InvoicePreviewModal } from "@/components/admin/InvoicePreviewModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate, formatMoney } from "@/lib/admin/format";
import type { InvoiceRow } from "@/lib/admin/types";

export function InvoicesTable({
  invoices,
  initialOpen,
}: {
  invoices: InvoiceRow[];
  initialOpen?: InvoiceRow | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<InvoiceRow | null>(
    initialOpen || null,
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!initialOpen) return;
    setSelected(initialOpen);
  }, [initialOpen]);

  return (
    <>
      <div className="relative overflow-x-auto border border-border bg-white shadow-sm">
        <AdminBusyOverlay pending={pending} label="Opening invoice…" />
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-light-bg text-xs tracking-wide text-secondary-text uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Number</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Issue date</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-secondary-text"
                >
                  No invoices match these filters.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="cursor-pointer transition hover:bg-light-bg/70"
                  onClick={() => setSelected(invoice)}
                  onDoubleClick={() => {
                    startTransition(() => {
                      router.push(`/admin/invoices/${invoice.id}`);
                    });
                  }}
                >
                  <td className="px-4 py-3 font-medium text-primary-text">
                    {invoice.number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-text">
                      {invoice.customer_name}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {invoice.customer_email}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-secondary-text">
                    {formatDate(invoice.issue_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-primary-text">
                    {formatMoney(invoice.total, invoice.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <InvoicePreviewModal
          invoice={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}
