import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function QuoteForm({
  defaultInterest,
  defaultSubject,
  backendReady,
}: {
  defaultInterest?: InterestArea;
  defaultSubject?: string;
  backendReady: boolean;
}) {
  return (
    <EnquiryForm
      type="quote"
      defaultInterest={defaultInterest || "products"}
      defaultSubject={defaultSubject}
      submitLabel="Request Quote"
      backendReady={backendReady}
    />
  );
}
