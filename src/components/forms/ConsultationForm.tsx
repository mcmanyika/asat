import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function ConsultationForm({
  defaultInterest,
  defaultSubject,
}: {
  defaultInterest?: InterestArea;
  defaultSubject?: string;
}) {
  return (
    <EnquiryForm
      type="consultation"
      defaultInterest={defaultInterest || "consulting"}
      defaultSubject={defaultSubject}
      submitLabel="Request Consultation"
    />
  );
}
