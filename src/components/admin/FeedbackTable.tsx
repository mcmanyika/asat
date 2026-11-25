"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FeedbackDetailModal } from "@/components/admin/FeedbackDetailModal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateFeedbackStatus } from "@/lib/admin/actions";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { FeedbackRow } from "@/lib/admin/types";

export function FeedbackTable({
  feedback,
  initialOpen,
}: {
  feedback: FeedbackRow[];
  initialOpen?: FeedbackRow | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<FeedbackRow | null>(
    initialOpen || null,
  );

  useEffect(() => {
    if (!initialOpen) return;
    setSelected(initialOpen);
  }, [initialOpen]);

  function closeModal() {
    setSelected(null);
    if (!searchParams.get("open")) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("open");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <>
      <div className="overflow-x-auto border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-light-bg text-xs tracking-wide text-secondary-text uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Visitor</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {feedback.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-secondary-text"
                >
                  No feedback match these filters.
                </td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer align-top transition hover:bg-light-bg/70"
                  onClick={() => setSelected(item)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-text">
                      {item.full_name || "Anonymous"}
                    </p>
                    {item.email ? (
                      <p className="text-xs text-secondary-text">{item.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{formatLabel(item.category)}</td>
                  <td className="px-4 py-3">
                    {item.rating ? `${item.rating}/5` : "—"}
                  </td>
                  <td className="max-w-sm px-4 py-3">
                    <p className="line-clamp-2 text-secondary-text">
                      {item.message}
                    </p>
                  </td>
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
                        action={updateFeedbackStatus}
                        options={[
                          { value: "new", label: "New" },
                          { value: "reviewed", label: "Reviewed" },
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
        <FeedbackDetailModal feedback={selected} onClose={closeModal} />
      ) : null}
    </>
  );
}
