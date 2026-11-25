"use client";

import { useTransition, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminFilterFormProps = {
  children: ReactNode;
  className?: string;
  resetHref?: string;
  showReset?: boolean;
};

export function AdminFilterForm({
  children,
  className,
  resetHref,
  showReset = false,
}: AdminFilterFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue;
      const trimmed = value.trim();
      if (!trimmed) continue;
      if (key === "sort" && trimmed === "newest") continue;
      params.set(key, trimmed);
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return (
    <div className="relative">
      <form
        method="get"
        onSubmit={onSubmit}
        aria-busy={pending}
        className={cn(
          "flex flex-wrap items-end gap-3 border border-border bg-white p-4 shadow-sm transition",
          pending && "pointer-events-none opacity-70",
          className,
        )}
      >
        {children}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Loading…
            </>
          ) : (
            "Apply"
          )}
        </button>
        {showReset ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(() => {
                router.push(resetHref || pathname);
              });
            }}
            className="px-3 py-2 text-sm text-secondary-text hover:text-primary-text disabled:opacity-60"
          >
            Reset
          </button>
        ) : null}
      </form>

      {pending ? (
        <div className="pointer-events-none absolute inset-x-0 top-full z-10 mt-3 flex items-center gap-2 text-sm text-secondary-text">
          <LoaderCircle className="size-4 animate-spin" />
          Updating results…
        </div>
      ) : null}
    </div>
  );
}
