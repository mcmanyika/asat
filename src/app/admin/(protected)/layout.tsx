import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireStaffUser } from "@/lib/admin/auth";

async function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const staff = await requireStaffUser();
  return <AdminShell staff={staff}>{children}</AdminShell>;
}

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-light-bg text-sm text-secondary-text">
          Loading staff dashboard…
        </div>
      }
    >
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}
