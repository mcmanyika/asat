import { Suspense } from "react";
import { StaffTable } from "@/components/admin/StaffTable";
import { listStaffProfiles } from "@/lib/admin/queries";

async function StaffContent() {
  const staff = await listStaffProfiles();
  const pendingCount = staff.filter((item) => item.status === "pending").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Staff access</h1>
        <p className="mt-1 text-sm text-secondary-text">
          Approve or reject dashboard access requests, and choose who gets
          enquiry email alerts.
          {pendingCount > 0 ? ` ${pendingCount} pending.` : ""}
        </p>
      </div>

      <StaffTable staff={staff} />
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-slate-200" />
          <div className="h-48 bg-slate-100" />
        </div>
      }
    >
      <StaffContent />
    </Suspense>
  );
}
