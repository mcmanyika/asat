import { interestAreas, type EnquiryFormValues } from "@/lib/validations/enquiry";
import type { InterestArea } from "@/types";

export function resolveInterest(
  value: string | string[] | undefined,
): InterestArea {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && (interestAreas as readonly string[]).includes(raw)) {
    return raw as InterestArea;
  }
  return "general";
}

export function resolveSubject(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

export type EnquirySearchParams = {
  interest?: string | string[];
  subject?: string | string[];
};

export function parseEnquirySearchParams(
  searchParams: EnquirySearchParams,
): Pick<EnquiryFormValues, "interest" | "subject"> {
  return {
    interest: resolveInterest(searchParams.interest),
    subject: resolveSubject(searchParams.subject),
  };
}
