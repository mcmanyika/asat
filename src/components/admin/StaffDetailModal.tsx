"use client";

import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import {
  updateStaffAccessStatus,
  updateStaffNotifyPreference,
} from "@/lib/admin/actions";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { StaffProfileRow } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type StaffDetailModalProps = {
  staff: StaffProfileRow;
  onClose: () => void;
  onUpdated: (staff: StaffProfileRow) => void;
};

export function StaffDetailModal({
  staff,
  onClose,
  onUpdated,
}: StaffDetailModalProps) {
  const [notifyEnabled, setNotifyEnabled] = useState(staff.notify_on_enquiry);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setNotifyEnabled(staff.notify_on_enquiry);
  }, [staff]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function toggleNotify() {
    if (staff.status !== "approved" && !notifyEnabled) {
      setError("Approve this staff member before enabling email notifications.");
      return;
    }

    const next = !notifyEnabled;
    setError(null);
    setNotifyEnabled(next);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("userId", staff.user_id);
      formData.set("notifyOnEnquiry", String(next));
      const result = await updateStaffNotifyPreference(formData);

      if (result?.error) {
        setNotifyEnabled(!next);
        setError(result.error);
        return;
      }

      onUpdated({ ...staff, notify_on_enquiry: next });
    });
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-modal-title"
        className="my-4 w-full max-w-xl border border-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Staff detail
            </p>
            <h2
              id="staff-modal-title"
              className="mt-1 text-xl font-bold text-primary-text"
            >
              {staff.full_name || "Unnamed staff"}
            </h2>
            <p className="mt-1 text-sm text-secondary-text">{staff.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center text-secondary-text transition hover:bg-light-bg hover:text-primary-text"
            aria-label="Close staff details"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
                Access status
              </dt>
              <dd className="mt-2 flex flex-wrap items-center gap-3">
                <StatusBadge status={staff.status} />
                <StatusSelect
                  id={staff.user_id}
                  status={staff.status}
                  action={updateStaffAccessStatus}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ]}
                />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
                Requested
              </dt>
              <dd className="mt-2 text-sm font-medium text-primary-text">
                {formatDateTime(staff.created_at)}
              </dd>
            </div>
          </dl>

          <div className="border border-border bg-light-bg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary-text">
                  Enquiry email notifications
                </p>
                <p className="mt-1 text-sm text-secondary-text">
                  When enabled, this approved staff member is emailed for new
                  website and chatbot enquiries.
                </p>
                <p className="mt-2 text-xs text-secondary-text">
                  Current: {formatLabel(notifyEnabled ? "enabled" : "disabled")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifyEnabled}
                disabled={pending}
                onClick={toggleNotify}
                className={cn(
                  "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition",
                  notifyEnabled
                    ? "border-gold bg-gold"
                    : "border-border bg-white",
                  pending && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "inline-block size-5 rounded-full bg-navy transition",
                    notifyEnabled ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>
          </div>

          {error ? (
            <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
