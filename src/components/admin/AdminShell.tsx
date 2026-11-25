"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Inbox,
  Settings,
  Users,
} from "lucide-react";
import { signOutStaff } from "@/lib/admin/actions";
import type { StaffUser } from "@/lib/admin/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const baseNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/admin/staff", label: "Staff", icon: Users },
] as const;

const settingsNav = {
  href: "/admin/settings",
  label: "Settings",
  icon: Settings,
} as const;

type AdminShellProps = {
  staff: StaffUser;
  children: React.ReactNode;
};

export function AdminShell({ staff, children }: AdminShellProps) {
  const pathname = usePathname();
  const nav =
    staff.role === "superuser" ? [...baseNav, settingsNav] : [...baseNav];

  return (
    <div className="flex h-dvh overflow-hidden bg-light-bg">
      <aside className="hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-navy text-white md:flex">
        <div className="shrink-0 border-b border-white/10 px-5 py-5">
          <p className="text-xs tracking-[0.18em] text-gold uppercase">
            {siteConfig.shortName} Staff
          </p>
          <p className="mt-1 text-sm font-semibold">Operations Dashboard</p>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[4px] px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-white/10 p-4">
          <p className="truncate text-xs text-slate-300">
            {staff.fullName || staff.email}
          </p>
          <form action={signOutStaff} className="mt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-white px-4 py-3 md:px-6">
          <div className="md:hidden">
            <p className="text-sm font-semibold text-primary-text">
              {siteConfig.shortName} Admin
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-secondary-text">
            <span className="hidden sm:inline">{staff.email}</span>
            <form action={signOutStaff} className="md:hidden">
              <button type="submit" className="text-navy hover:text-gold-dark">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-border bg-white px-4 py-2 md:hidden">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[4px] px-3 py-1.5 text-sm whitespace-nowrap",
                  active
                    ? "bg-navy text-white"
                    : "bg-light-bg text-secondary-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
