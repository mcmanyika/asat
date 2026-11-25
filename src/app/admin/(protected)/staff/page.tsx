import { Suspense } from "react";
import { AdminFilterForm } from "@/components/admin/AdminFilterForm";
import { AdminPageSkeleton } from "@/components/admin/AdminBusy";
import { StaffTable } from "@/components/admin/StaffTable";
import { listStaffProfiles } from "@/lib/admin/queries";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  role?: string;
  sort?: string;
}>;

async function StaffContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const staff = await listStaffProfiles({
    q: filters.q,
    status: filters.status,
    role: filters.role,
    sort: filters.sort,
  });
  const pendingCount = staff.filter((item) => item.status === "pending").length;

  const hasFilters = Boolean(
    filters.q ||
      filters.status ||
      filters.role ||
      (filters.sort && filters.sort !== "newest"),
  );

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

      <AdminFilterForm resetHref="/admin/staff" showReset={hasFilters}>
        <label className="min-w-[12rem] flex-1 space-y-1">
          <span className="text-xs font-medium text-secondary-text">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q || ""}
            placeholder="Name or email"
            className="w-full rounded-[4px] border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Status</span>
          <select
            name="status"
            defaultValue={filters.status || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Role</span>
          <select
            name="role"
            defaultValue={filters.role || ""}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="">All roles</option>
            <option value="staff">Staff</option>
            <option value="superuser">Superuser</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-secondary-text">Sort</span>
          <select
            name="sort"
            defaultValue={filters.sort || "newest"}
            className="block rounded-[4px] border border-border px-3 py-2 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="email_asc">Email A–Z</option>
            <option value="email_desc">Email Z–A</option>
            <option value="status">Status</option>
          </select>
        </label>
      </AdminFilterForm>

      <p className="text-sm text-secondary-text">
        {staff.length} {staff.length === 1 ? "profile" : "profiles"}
        {hasFilters ? " matching filters" : ""}
      </p>

      <StaffTable staff={staff} />
    </div>
  );
}

export default function AdminStaffPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <StaffContent searchParams={searchParams} />
    </Suspense>
  );
}
