import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getStaffUser } from "@/lib/admin/auth";
import { siteConfig } from "@/config/site";
import { isEnquiryBackendReady } from "@/lib/supabase/config";

export const instant = false;

async function AdminLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const staff = await getStaffUser();
  if (staff) redirect("/admin");

  const params = await searchParams;
  const recoveryError =
    params.error === "recovery_failed" || params.error === "recovery_expired"
      ? "That password reset link is invalid or expired. Request a new one."
      : null;

  return (
    <div className="w-full max-w-md border border-border bg-white p-6 shadow-sm md:p-8">
      <Image
        src="/images/logo/asat-logo.png"
        alt={`${siteConfig.name} logo`}
        width={160}
        height={42}
        className="h-9 w-auto object-contain"
      />
      <h1 className="mt-5 text-2xl font-bold text-primary-text">
        Staff sign in
      </h1>
      <p className="mt-2 text-sm text-secondary-text">
        Access enquiries, feedback and operational analytics.
      </p>

      {recoveryError ? (
        <p className="mt-5 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {recoveryError}
        </p>
      ) : null}

      {!isEnquiryBackendReady() ? (
        <p className="mt-5 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Supabase is not configured. Add{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run{" "}
          <code>supabase/staff-dashboard.sql</code>.
        </p>
      ) : (
        <div className="mt-6">
          <LoginForm />
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <Suspense
        fallback={
          <div className="text-sm text-secondary-text">Loading sign in…</div>
        }
      >
        <AdminLoginContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
