import { Suspense } from "react";
import { connection } from "next/server";
import { LandingSectionsForm } from "@/components/admin/LandingSectionsForm";
import { NotifyEmailsForm } from "@/components/admin/NotifyEmailsForm";
import { requireSuperuser } from "@/lib/admin/auth";
import { getLandingSectionsVisibilityFresh } from "@/lib/content/landing-sections";
import { getEnquiryNotifyEmailsSetting } from "@/lib/email/config";

async function SettingsContent() {
  await connection();
  await requireSuperuser();
  const [notifySetting, landingSections] = await Promise.all([
    getEnquiryNotifyEmailsSetting(),
    getLandingSectionsVisibilityFresh(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Settings</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Control enquiry alerts and which landing page sections are visible.
        </p>
      </div>

      <section className="max-w-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-primary-text">
          Landing page sections
        </h2>
        <p className="mt-1 mb-4 text-sm text-secondary-text">
          Toggle sections on the public home page. Hidden sections are not
          rendered for visitors.
        </p>
        <LandingSectionsForm initial={landingSections} />
      </section>

      <section className="max-w-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-primary-text">
          Enquiry notifications
        </h2>
        <p className="mt-1 mb-4 text-sm text-secondary-text">
          Extra recipients in addition to staff marked for email alerts under
          Staff.
        </p>
        <NotifyEmailsForm
          initialValue={notifySetting.value}
          envFallback={notifySetting.envFallback}
          source={notifySetting.source}
        />
      </section>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-slate-200" />
          <div className="h-48 max-w-2xl bg-slate-100" />
          <div className="h-48 max-w-2xl bg-slate-100" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
