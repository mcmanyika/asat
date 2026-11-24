import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function DemoForm({
  defaultInterest,
  defaultSubject,
}: {
  defaultInterest?: InterestArea;
  defaultSubject?: string;
}) {
  return (
    <EnquiryForm
      type="demo"
      defaultInterest={defaultInterest || "business-systems"}
      defaultSubject={defaultSubject}
      submitLabel="Request Demo"
    />
  );
}
