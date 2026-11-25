import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { siteConfig } from "@/config/site";

export const instant = false;

async function ResetPasswordContent() {
  await connection();

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect("/admin/login?error=recovery_expired");
  }

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
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-secondary-text">
        Signed in as {user.email}. Set a new password to continue.
      </p>
      <div className="mt-6">
        <ResetPasswordForm />
      </div>
      <p className="mt-5 text-sm text-secondary-text">
        <Link href="/admin/login" className="text-gold-dark hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <Suspense
        fallback={
          <div className="text-sm text-secondary-text">Checking session…</div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
