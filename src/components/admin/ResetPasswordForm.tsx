"use client";

import { useActionState } from "react";
import { updateStaffPassword } from "@/lib/admin/actions";

type State = { error?: string } | null;

async function action(
  _prev: State,
  formData: FormData,
): Promise<State> {
  return updateStaffPassword(formData);
}

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form className="space-y-4" action={formAction}>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-[4px] border border-border px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-[4px] border border-border px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>

      {state?.error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
