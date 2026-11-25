"use client";

import { useState } from "react";
import { EnquiryDetailModal } from "@/components/admin/EnquiryDetailModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateEnquiryStatus } from "@/lib/admin/actions";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { EnquiryRow } from "@/lib/admin/types";

export function EnquiriesTable({ enquiries }: { enquiries: EnquiryRow[] }) {
  const [selected, setSelected] = useState<EnquiryRow | null>(null);

  return (
    <>
      <div className="overflow-x-auto border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-light-bg text-xs tracking-wide text-secondary-text uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Interest</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {enquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-secondary-text"
                >
                  No enquiries match these filters.
                </td>
              </tr>
            ) : (
              enquiries.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer align-top transition hover:bg-light-bg/70"
                  onClick={() => setSelected(item)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-text">
                      {item.full_name}
                    </p>
                    <p className="text-secondary-text">{item.company_name}</p>
                    <p className="text-xs text-secondary-text">{item.email}</p>
                  </td>
                  <td className="px-4 py-3">{formatLabel(item.type)}</td>
                  <td className="px-4 py-3">{formatLabel(item.interest)}</td>
                  <td className="px-4 py-3">{formatLabel(item.source)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={item.status} />
                      <StatusSelect
                        id={item.id}
                        status={item.status}
                        action={updateEnquiryStatus}
                        options={[
                          { value: "new", label: "New" },
                          { value: "in_progress", label: "In progress" },
                          { value: "closed", label: "Closed" },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <EnquiryDetailModal
          enquiry={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}
