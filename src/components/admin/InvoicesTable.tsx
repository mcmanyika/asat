"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate, formatMoney } from "@/lib/admin/format";
import type { InvoiceRow } from "@/lib/admin/types";

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto border border-border bg-white shadow-sm">
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
                No invoices yet.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="cursor-pointer transition hover:bg-light-bg/70"
                onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
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
  );
}
