"use client";

import Link from "next/link";
import { AdminModal } from "@/components/admin/AdminModal";
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
  const invoiceHref = `/admin/invoices/new?enquiryId=${enquiry.id}&name=${encodeURIComponent(enquiry.full_name)}&email=${encodeURIComponent(enquiry.email)}&company=${encodeURIComponent(enquiry.company_name)}&phone=${encodeURIComponent(enquiry.telephone)}`;

  return (
    <AdminModal
      eyebrow="Enquiry detail"
      title={enquiry.full_name}
      subtitle={`${formatLabel(enquiry.type)} · ${formatDateTime(enquiry.created_at)}`}
      onClose={onClose}
      size="lg"
      labelledBy="enquiry-modal-title"
      footer={
        <div className="flex flex-wrap gap-3">
          <Link
            href={invoiceHref}
            className="inline-flex items-center justify-center bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15233a]"
          >
            Create invoice
          </Link>
          <a
            href={`mailto:${enquiry.email}`}
            className="inline-flex items-center justify-center border border-border bg-white px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-light-bg"
          >
            Email contact
          </a>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
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
    </AdminModal>
  );
}
