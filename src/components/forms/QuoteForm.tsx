import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function QuoteForm({
  defaultInterest,
  defaultSubject,
}: {
  defaultInterest?: InterestArea;
  defaultSubject?: string;
}) {
  return (
    <EnquiryForm
      type="quote"
      defaultInterest={defaultInterest || "products"}
      defaultSubject={defaultSubject}
      submitLabel="Request Quote"
    />
  );
}
