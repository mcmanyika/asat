import { EnquiryForm } from "@/components/forms/EnquiryForm";
import type { InterestArea } from "@/types";

export function DemoForm({
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
      type="demo"
      defaultInterest={defaultInterest || "business-systems"}
      defaultSubject={defaultSubject}
      submitLabel="Request Demo"
      backendReady={backendReady}
    />
  );
}
