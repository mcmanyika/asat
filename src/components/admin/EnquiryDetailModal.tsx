"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateEnquiryStatus } from "@/lib/admin/actions";
import { formatDateTime, formatLabel } from "@/lib/admin/format";
import type { EnquiryRow } from "@/lib/admin/types";

type EnquiryDetailModalProps = {
  enquiry: EnquiryRow;
  onClose: () => void;
};

export function EnquiryDetailModal({
  enquiry,
  onClose,
}: EnquiryDetailModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="my-4 w-full max-w-3xl border border-border bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
              Enquiry detail
            </p>
            <h2
              id="enquiry-modal-title"
              className="mt-1 text-xl font-bold text-primary-text"
            >
              {enquiry.full_name}
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              {formatLabel(enquiry.type)} · {formatDateTime(enquiry.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center text-secondary-text transition hover:bg-light-bg hover:text-primary-text"
            aria-label="Close enquiry details"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <StatusBadge status={enquiry.status} />
              <StatusSelect
                id={enquiry.id}
                status={enquiry.status}
                action={updateEnquiryStatus}
                options={[
                  { value: "new", label: "New" },
                  { value: "in_progress", label: "In progress" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            </div>

            <h3 className="text-sm font-semibold text-primary-text">Contact</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-secondary-text">Company</dt>
                <dd className="font-medium text-primary-text">
                  {enquiry.company_name}
                </dd>
              </div>
              <div>
                <dt className="text-secondary-text">Email</dt>
                <dd>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="font-medium text-gold-dark hover:underline"
                  >
                    {enquiry.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-secondary-text">Telephone</dt>
                <dd>
                  <a
                    href={`tel:${enquiry.telephone.replace(/\s+/g, "")}`}
                    className="font-medium text-gold-dark hover:underline"
                  >
                    {enquiry.telephone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-secondary-text">Interest</dt>
                <dd className="font-medium text-primary-text">
                  {formatLabel(enquiry.interest)}
                </dd>
              </div>
              <div>
                <dt className="text-secondary-text">Source</dt>
                <dd className="font-medium text-primary-text">
                  {formatLabel(enquiry.source)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-primary-text">Message</h3>
            {enquiry.subject ? (
              <p className="mt-3 text-sm font-medium text-primary-text">
                {enquiry.subject}
              </p>
            ) : null}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-secondary-text">
              {enquiry.message}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
