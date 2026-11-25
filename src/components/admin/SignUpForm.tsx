"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpStaff } from "@/lib/admin/actions";

type SignUpState = {
  error?: string;
  ok?: boolean;
  pendingApproval?: boolean;
  needsConfirmation?: boolean;
} | null;

async function signUpAction(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  return signUpStaff(formData);
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, null);

  if (state?.ok && state.pendingApproval) {
    return (
      <div className="space-y-4">
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Account created. An approved admin must confirm your access before you
          can use the dashboard.
          {state.needsConfirmation
            ? " If email confirmation is enabled, check your inbox as well."
            : ""}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex text-sm font-medium text-gold-dark hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" action={formAction}>
      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-[4px] border border-border px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
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
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-primary-text"
        >
          Password
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
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
