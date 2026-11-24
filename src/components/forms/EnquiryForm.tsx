"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  enquirySchema,
  interestLabels,
  type EnquiryFormValues,
} from "@/lib/validations/enquiry";
import { isEnquiryBackendReady } from "@/lib/supabase/config";
import { getConfiguredContactFields } from "@/config/site";
import { cn } from "@/lib/utils";
import type { EnquiryFormType, InterestArea } from "@/types";

type EnquiryFormProps = {
  type: EnquiryFormType;
  defaultInterest?: InterestArea;
  defaultSubject?: string;
  submitLabel?: string;
};

const typeCopy: Record<
  EnquiryFormType,
  { title: string; intro: string }
> = {
  contact: {
    title: "Send an Enquiry",
    intro: "Share your requirements and our team will follow up.",
  },
  quote: {
    title: "Request a Quote",
    intro: "Tell us what you need and we will prepare a tailored response.",
  },
  demo: {
    title: "Request a Demo",
    intro: "Request a demonstration of the business system you are evaluating.",
  },
  consultation: {
    title: "Request a Consultation",
    intro: "Book a consultation to discuss technology and business priorities.",
  },
};

export function EnquiryForm({
  type,
  defaultInterest = "general",
  defaultSubject,
  submitLabel = "Submit Enquiry",
}: EnquiryFormProps) {
  const backendReady = isEnquiryBackendReady();
  const contact = getConfiguredContactFields();
  const [status, setStatus] = useState<
    "idle" | "blocked" | "error" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      telephone: "",
      interest: defaultInterest,
      subject: defaultSubject || "",
      message: "",
      privacyConsent: false,
    },
  });

  const alternativeContact = useMemo(() => {
    const parts: string[] = [];
    if (contact.email) parts.push(contact.email);
    if (contact.phone) parts.push(contact.phone);
    return parts;
  }, [contact.email, contact.phone]);

  const onSubmit = async (values: EnquiryFormValues) => {
    setErrorMessage(null);

    if (!backendReady) {
      setStatus("blocked");
      return;
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data?.error ||
            "Unable to save your enquiry right now. Please try again.",
        );
        return;
      }

      setStatus("success");
      reset({
        fullName: "",
        companyName: "",
        email: "",
        telephone: "",
        interest: defaultInterest,
        subject: defaultSubject || "",
        message: "",
        privacyConsent: false,
      });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Unable to reach the enquiry service. Please try again shortly.",
      );
    }
  };

  const copy = typeCopy[type];

  return (
    <div className="border border-border bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-primary-text">{copy.title}</h2>
      <p className="mt-2 text-sm text-secondary-text">{copy.intro}</p>

      {!backendReady ? (
        <div
          role="status"
          className="mt-5 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Enquiry processing is not connected yet. Your details will not be
          stored until Supabase is configured
          {alternativeContact.length > 0
            ? `. Please contact us directly at ${alternativeContact.join(" or ")}.`
            : ". Please check back once contact channels are published."}
        </div>
      ) : null}

      {status === "blocked" ? (
        <div
          role="alert"
          className="mt-4 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          Submission is paused until Supabase is configured. No message was
          discarded silently or marked as successful.
        </div>
      ) : null}

      {status === "error" && errorMessage ? (
        <div
          role="alert"
          className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      ) : null}

      {status === "success" ? (
        <div
          role="status"
          className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Thank you. Your enquiry has been received and our team will follow up.
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Full name"
            error={errors.fullName?.message}
            htmlFor="fullName"
          >
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              className={fieldClass(errors.fullName)}
              {...register("fullName")}
            />
          </Field>
          <Field
            label="Company name"
            error={errors.companyName?.message}
            htmlFor="companyName"
          >
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              className={fieldClass(errors.companyName)}
              {...register("companyName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Email address"
            error={errors.email?.message}
            htmlFor="email"
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={fieldClass(errors.email)}
              {...register("email")}
            />
          </Field>
          <Field
            label="Telephone number"
            error={errors.telephone?.message}
            htmlFor="telephone"
          >
            <input
              id="telephone"
              type="tel"
              autoComplete="tel"
              className={fieldClass(errors.telephone)}
              {...register("telephone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Area of interest"
            error={errors.interest?.message}
            htmlFor="interest"
          >
            <select
              id="interest"
              className={fieldClass(errors.interest)}
              {...register("interest")}
            >
              {Object.entries(interestLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Subject (optional)"
            error={errors.subject?.message}
            htmlFor="subject"
          >
            <input
              id="subject"
              type="text"
              className={fieldClass(errors.subject)}
              {...register("subject")}
            />
          </Field>
        </div>

        <Field label="Message" error={errors.message?.message} htmlFor="message">
          <textarea
            id="message"
            rows={5}
            className={cn(fieldClass(errors.message), "resize-y")}
            {...register("message")}
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm text-secondary-text">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded-[2px] border-border text-corporate-blue"
              {...register("privacyConsent")}
            />
            <span>
              I agree to the processing of my enquiry details in accordance with
              the{" "}
              <a
                href="/privacy-policy"
                className="font-medium text-corporate-blue hover:underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.privacyConsent?.message ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.privacyConsent.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-[4px] bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-primary-text"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function fieldClass(error?: { message?: string }) {
  return cn(
    "w-full rounded-[4px] border bg-white px-3 py-2.5 text-sm text-primary-text outline-none transition focus:border-corporate-blue",
    error ? "border-red-400" : "border-border",
  );
}
