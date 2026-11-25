"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInStaff } from "@/lib/admin/actions";

type LoginState = { error?: string } | null;

async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  return signInStaff(formData);
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

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
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary-text"
          >
            Password
          </label>
          <Link
            href="/admin/forgot-password"
            className="text-xs font-medium text-gold-dark hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-secondary-text">
        Don&apos;t have an account?{" "}
        <Link href="/admin/signup" className="text-gold-dark hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
