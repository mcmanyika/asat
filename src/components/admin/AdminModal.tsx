"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminModalProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
  labelledBy?: string;
};

const sizeClass = {
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function AdminModal({
  title,
  subtitle,
  eyebrow,
  onClose,
  children,
  footer,
  size = "lg",
  labelledBy = "admin-modal-title",
}: AdminModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-navy/50 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "my-4 w-full border border-border bg-white shadow-2xl",
          sizeClass[size],
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={labelledBy}
              className={cn(
                "text-xl font-bold text-primary-text",
                eyebrow && "mt-1",
              )}
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-secondary-text">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center text-secondary-text transition hover:bg-light-bg hover:text-primary-text"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="border-t border-border bg-light-bg/60 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
