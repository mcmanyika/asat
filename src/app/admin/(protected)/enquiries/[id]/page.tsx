import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateEnquiryStatus } from "@/lib/admin/actions";
import { getEnquiryById } from "@/lib/admin/queries";
import { formatDateTime, formatLabel } from "@/lib/admin/format";

async function EnquiryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) notFound();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/enquiries"
            className="text-sm text-secondary-text hover:text-primary-text"
          >
            ← Back to enquiries
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-primary-text">
            {enquiry.full_name}
          </h1>
          <p className="mt-1 text-sm text-secondary-text">
            {formatLabel(enquiry.type)} · {formatDateTime(enquiry.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="border border-border bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold text-primary-text">Contact</h2>
          <dl className="mt-4 space-y-3 text-sm">
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

        <section className="border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-primary-text">Message</h2>
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
  );
}

export default function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-slate-200" />
          <div className="h-40 bg-slate-100" />
        </div>
      }
    >
      <EnquiryDetail params={params} />
    </Suspense>
  );
}
