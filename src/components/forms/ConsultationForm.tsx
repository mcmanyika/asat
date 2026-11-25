import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function ConsultationForm({
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
      type="consultation"
      defaultInterest={defaultInterest || "consulting"}
      defaultSubject={defaultSubject}
      submitLabel="Request Consultation"
      backendReady={backendReady}
    />
  );
}
