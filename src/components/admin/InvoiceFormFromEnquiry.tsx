"use client";

import { InvoiceForm } from "@/components/admin/InvoiceForm";
import type { InvoiceWithItems } from "@/lib/admin/types";

type InvoiceFormFromEnquiryProps = {
  enquiryId?: string | null;
  defaults: {
    customer_name: string;
    customer_email: string;
    customer_company: string;
    customer_phone: string;
  };
};

export function InvoiceFormFromEnquiry({
  enquiryId,
  defaults,
}: InvoiceFormFromEnquiryProps) {
  const hasDefaults = Boolean(
    defaults.customer_name ||
      defaults.customer_email ||
      defaults.customer_company ||
      defaults.customer_phone,
  );

  const seed = hasDefaults
    ? ({
        id: "",
        number: "",
        status: "draft",
        customer_name: defaults.customer_name,
        customer_email: defaults.customer_email,
        customer_company: defaults.customer_company || null,
        customer_phone: defaults.customer_phone || null,
        customer_address: null,
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: null,
        currency: "USD",
        tax_rate: 0,
        notes: null,
        enquiry_id: enquiryId || null,
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        created_by: null,
        created_at: "",
        updated_at: "",
        items: [],
      } satisfies InvoiceWithItems)
    : undefined;

  return (
    <InvoiceForm
      mode="create"
      enquiryId={enquiryId}
      invoice={seed}
    />
  );
}
