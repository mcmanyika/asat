"use client";

import { useActionState } from "react";
import { updateEnquiryNotifyEmails } from "@/lib/admin/actions";

type State = { error?: string; ok?: true; count?: number } | null;

async function saveAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  return updateEnquiryNotifyEmails(formData);
}

type NotifyEmailsFormProps = {
  initialValue: string;
  envFallback: string[];
  source: "database" | "env" | "empty";
};

export function NotifyEmailsForm({
  initialValue,
  envFallback,
  source,
}: NotifyEmailsFormProps) {
  const [state, formAction, pending] = useActionState(saveAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="emails"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          Enquiry notify emails
        </label>
        <p className="mb-3 text-sm text-secondary-text">
          One email per line (or comma-separated). These addresses receive alerts
          when a website or chatbot enquiry is submitted.
        </p>
        <textarea
          id="emails"
          name="emails"
          rows={6}
          defaultValue={initialValue}
          placeholder={"info@asat-technologies.com\nsales@asat-technologies.com"}
          className="w-full rounded-[4px] border border-border px-3 py-2.5 font-mono text-sm outline-none focus:border-gold"
        />
      </div>

      <p className="text-xs text-secondary-text">
        {source === "database"
          ? "Currently using values saved in the database."
          : source === "env"
            ? `No database value yet. Falling back to env: ${envFallback.join(", ") || "none"}.`
            : envFallback.length > 0
              ? `Database value is empty. Falling back to env: ${envFallback.join(", ")}.`
              : "No recipients configured yet."}
      </p>

      {state?.error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Saved {state.count ?? 0} recipient
          {(state.count ?? 0) === 1 ? "" : "s"}.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save notify emails"}
      </button>
    </form>
  );
}
