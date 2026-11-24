import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { DemoForm } from "@/components/forms/DemoForm";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { parseEnquirySearchParams } from "@/lib/enquiry-params";
import type { EnquiryFormType, InterestArea } from "@/types";

type SearchParamsPromise = Promise<{
  interest?: string;
  subject?: string;
}>;

type EnquiryFormLoaderProps = {
  type: EnquiryFormType;
  searchParams: SearchParamsPromise;
  fallbackInterest?: InterestArea;
};

function FormFallback() {
  return (
    <div className="border border-border bg-white p-6 shadow-sm md:p-8">
      <div className="h-7 w-48 animate-pulse bg-slate-100" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse bg-slate-100" />
      <div className="mt-6 space-y-4">
        <div className="h-11 animate-pulse bg-slate-100" />
        <div className="h-11 animate-pulse bg-slate-100" />
        <div className="h-28 animate-pulse bg-slate-100" />
      </div>
    </div>
  );
}

async function EnquiryFormInner({
  type,
  searchParams,
  fallbackInterest,
}: EnquiryFormLoaderProps) {
  const params = parseEnquirySearchParams(await searchParams);
  const interest =
    params.interest === "general" && fallbackInterest
      ? fallbackInterest
      : params.interest;

  if (type === "quote") {
    return (
      <QuoteForm defaultInterest={interest} defaultSubject={params.subject} />
    );
  }
  if (type === "demo") {
    return (
      <DemoForm defaultInterest={interest} defaultSubject={params.subject} />
    );
  }
  if (type === "consultation") {
    return (
      <ConsultationForm
        defaultInterest={interest}
        defaultSubject={params.subject}
      />
    );
  }
  return (
    <ContactForm defaultInterest={interest} defaultSubject={params.subject} />
  );
}

export function EnquiryFormLoader(props: EnquiryFormLoaderProps) {
  return (
    <Suspense fallback={<FormFallback />}>
      <EnquiryFormInner {...props} />
    </Suspense>
  );
}
