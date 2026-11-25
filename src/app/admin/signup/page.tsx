import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignUpForm } from "@/components/admin/SignUpForm";
import { getStaffUser } from "@/lib/admin/auth";
import { siteConfig } from "@/config/site";
import { isEnquiryBackendReady } from "@/lib/supabase/config";

export const instant = false;

async function AdminSignUpContent() {
  const staff = await getStaffUser();
  if (staff) redirect("/admin");

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
        Create staff account
      </h1>
      <p className="mt-2 text-sm text-secondary-text">
        Register for the ASAT operations dashboard. Access stays pending until
        an approved admin confirms your account.
      </p>

      {!isEnquiryBackendReady() ? (
        <p className="mt-5 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Supabase is not configured.
        </p>
      ) : (
        <div className="mt-6">
          <SignUpForm />
        </div>
      )}

      <p className="mt-5 text-sm text-secondary-text">
        Already have an account?{" "}
        <Link href="/admin/login" className="text-gold-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function AdminSignUpPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <Suspense
        fallback={
          <div className="text-sm text-secondary-text">Loading…</div>
        }
      >
        <AdminSignUpContent />
      </Suspense>
    </div>
  );
}
