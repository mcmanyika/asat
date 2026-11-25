import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";
import { siteConfig } from "@/config/site";
import { isEnquiryBackendReady } from "@/lib/supabase/config";

export const instant = false;

export default function AdminForgotPasswordPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md border border-border bg-white p-6 shadow-sm md:p-8">
        <Image
          src="/images/logo/asat-logo.png"
          alt={`${siteConfig.name} logo`}
          width={160}
          height={42}
          className="h-9 w-auto object-contain"
        />
        <h1 className="mt-5 text-2xl font-bold text-primary-text">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-secondary-text">
          Enter your staff email and we will send a secure reset link.
        </p>

        {!isEnquiryBackendReady() ? (
          <p className="mt-5 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Supabase is not configured.
          </p>
        ) : (
          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
        )}

        <p className="mt-5 text-sm text-secondary-text">
          <Link href="/admin/login" className="text-gold-dark hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
