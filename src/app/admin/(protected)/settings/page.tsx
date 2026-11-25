import { Suspense } from "react";
import { connection } from "next/server";
import { NotifyEmailsForm } from "@/components/admin/NotifyEmailsForm";
import { getEnquiryNotifyEmailsSetting } from "@/lib/email/config";

async function SettingsContent() {
  await connection();
  const setting = await getEnquiryNotifyEmailsSetting();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Settings</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Extra enquiry notification recipients (in addition to staff marked for
          email alerts under Staff).
        </p>
      </div>

      <section className="max-w-2xl border border-border bg-white p-5 shadow-sm">
        <NotifyEmailsForm
          initialValue={setting.value}
          envFallback={setting.envFallback}
          source={setting.source}
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
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
