"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/admin/actions";

type State = { error?: string; ok?: boolean } | null;

async function action(
  _prev: State,
  formData: FormData,
): Promise<State> {
  return requestPasswordReset(formData);
}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form className="space-y-4" action={formAction}>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-[4px] border border-border px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>

      {state?.error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          If that email exists, a reset link has been sent. Open it to set a new
          password.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
