import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function ContactForm({
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
      type="contact"
      defaultInterest={defaultInterest || "general"}
      defaultSubject={defaultSubject}
      submitLabel="Send Enquiry"
      backendReady={backendReady}
    />
  );
}
