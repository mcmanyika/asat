import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function ContactForm({
  defaultInterest,
  defaultSubject,
}: {
  defaultInterest?: InterestArea;
  defaultSubject?: string;
}) {
  return (
    <EnquiryForm
      type="contact"
      defaultInterest={defaultInterest}
      defaultSubject={defaultSubject}
      submitLabel="Send Enquiry"
    />
  );
}
