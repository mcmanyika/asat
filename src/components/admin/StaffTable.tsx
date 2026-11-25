"use client";

import { useState } from "react";
import { StaffDetailModal } from "@/components/admin/StaffDetailModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateStaffAccessStatus } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/admin/format";
import type { StaffProfileRow } from "@/lib/admin/types";

export function StaffTable({ staff }: { staff: StaffProfileRow[] }) {
  const [rows, setRows] = useState(staff);
  const [selected, setSelected] = useState<StaffProfileRow | null>(null);

  return (
    <>
      <div className="overflow-x-auto border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-light-bg text-xs tracking-wide text-secondary-text uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Requested</th>
              <th className="px-4 py-3 font-semibold">Emails</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-secondary-text"
                >
                  No staff profiles yet.
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr
                  key={item.user_id}
                  className="cursor-pointer align-top transition hover:bg-light-bg/70"
                  onClick={() => setSelected(item)}
                >
                  <td className="px-4 py-3 font-medium text-primary-text">
                    {item.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-secondary-text">{item.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-secondary-text">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.notify_on_enquiry
                          ? "font-medium text-emerald-800"
                          : "text-secondary-text"
                      }
                    >
                      {item.notify_on_enquiry ? "On" : "Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <StatusSelect
                      id={item.user_id}
                      status={item.status}
                      action={updateStaffAccessStatus}
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <StaffDetailModal
          staff={selected}
          onClose={() => setSelected(null)}
          onUpdated={(next) => {
            setSelected(next);
            setRows((current) =>
              current.map((row) =>
                row.user_id === next.user_id ? next : row,
              ),
            );
          }}
        />
      ) : null}
    </>
  );
}
