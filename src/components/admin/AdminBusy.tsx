"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminBusyOverlay({
  pending,
  label = "Loading…",
  className,
}: {
  pending: boolean;
  label?: string;
  className?: string;
}) {
  if (!pending) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[1px]",
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="inline-flex items-center gap-2 border border-border bg-white px-4 py-2 text-sm font-medium text-primary-text shadow-sm">
        <LoaderCircle className="size-4 animate-spin text-gold-dark" />
        {label}
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200" />
        <div className="h-4 w-72 bg-slate-100" />
      </div>
      <div className="h-24 bg-slate-100" />
      <div className="h-64 bg-slate-100" />
    </div>
  );
}
