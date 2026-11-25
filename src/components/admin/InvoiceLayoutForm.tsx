"use client";

import { useActionState, useState } from "react";
import { updateInvoiceLayout } from "@/lib/admin/actions";
import type { InvoiceLayoutSettings } from "@/lib/invoices/layout-shared";
import { cn } from "@/lib/utils";

type State = { error?: string; ok?: true } | null;

async function saveAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  return updateInvoiceLayout(formData);
}

type InvoiceLayoutFormProps = {
  initial: InvoiceLayoutSettings;
};

export function InvoiceLayoutForm({ initial }: InvoiceLayoutFormProps) {
  const [layout, setLayout] = useState(initial);
  const [state, formAction, pending] = useActionState(saveAction, null);

  function toggle(
    key: "showLogo" | "showStatus" | "showDueDate" | "showTax",
  ) {
    setLayout((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="showLogo" value={String(layout.showLogo)} />
      <input
        type="hidden"
        name="showStatus"
        value={String(layout.showStatus)}
      />
      <input
        type="hidden"
        name="showDueDate"
        value={String(layout.showDueDate)}
      />
      <input type="hidden" name="showTax" value={String(layout.showTax)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-primary-text">
            Company name
          </span>
          <input
            name="companyName"
            required
            value={layout.companyName}
            onChange={(e) =>
              setLayout((prev) => ({ ...prev, companyName: e.target.value }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Company email
          </span>
          <input
            name="companyEmail"
            type="email"
            value={layout.companyEmail}
            onChange={(e) =>
              setLayout((prev) => ({ ...prev, companyEmail: e.target.value }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Company phone
          </span>
          <input
            name="companyPhone"
            value={layout.companyPhone}
            onChange={(e) =>
              setLayout((prev) => ({ ...prev, companyPhone: e.target.value }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-primary-text">
            Company address
          </span>
          <textarea
            name="companyAddress"
            rows={2}
            value={layout.companyAddress}
            onChange={(e) =>
              setLayout((prev) => ({
                ...prev,
                companyAddress: e.target.value,
              }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Document title
          </span>
          <input
            name="documentTitle"
            value={layout.documentTitle}
            onChange={(e) =>
              setLayout((prev) => ({
                ...prev,
                documentTitle: e.target.value,
              }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Accent color
          </span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layout.accentColor}
              onChange={(e) =>
                setLayout((prev) => ({
                  ...prev,
                  accentColor: e.target.value.toUpperCase(),
                }))
              }
              className="h-10 w-12 cursor-pointer rounded-[4px] border border-border bg-white p-1"
            />
            <input
              name="accentColor"
              value={layout.accentColor}
              onChange={(e) =>
                setLayout((prev) => ({
                  ...prev,
                  accentColor: e.target.value,
                }))
              }
              className="w-full rounded-[4px] border border-border px-3 py-2.5 font-mono text-sm outline-none focus:border-gold"
            />
          </div>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Header layout
          </span>
          <select
            name="headerStyle"
            value={layout.headerStyle}
            onChange={(e) =>
              setLayout((prev) => ({
                ...prev,
                headerStyle:
                  e.target.value === "stacked" ? "stacked" : "split",
              }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          >
            <option value="split">Split (company left, title right)</option>
            <option value="stacked">Stacked (all left-aligned)</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Logo path
          </span>
          <input
            name="logoPath"
            value={layout.logoPath}
            onChange={(e) =>
              setLayout((prev) => ({ ...prev, logoPath: e.target.value }))
            }
            placeholder="/images/logo/asat-logo.png"
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Default currency
          </span>
          <input
            name="defaultCurrency"
            value={layout.defaultCurrency}
            onChange={(e) =>
              setLayout((prev) => ({
                ...prev,
                defaultCurrency: e.target.value,
              }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Default tax rate (%)
          </span>
          <input
            type="number"
            min={0}
            step="0.001"
            name="defaultTaxRate"
            value={layout.defaultTaxRate}
            onChange={(e) =>
              setLayout((prev) => ({
                ...prev,
                defaultTaxRate: Number(e.target.value) || 0,
              }))
            }
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
      </div>

      <ul className="divide-y divide-border border border-border">
        {(
          [
            ["showLogo", "Show logo"],
            ["showStatus", "Show invoice status"],
            ["showDueDate", "Show due date"],
            ["showTax", "Show tax line"],
          ] as const
        ).map(([key, label]) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <p className="text-sm font-medium text-primary-text">{label}</p>
            <button
              type="button"
              role="switch"
              aria-checked={layout[key]}
              onClick={() => toggle(key)}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                layout[key] ? "bg-corporate-blue" : "bg-slate-300",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
                  layout[key] && "translate-x-5",
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-primary-text">
          Footer note
        </span>
        <textarea
          name="footerNote"
          rows={3}
          value={layout.footerNote}
          onChange={(e) =>
            setLayout((prev) => ({ ...prev, footerNote: e.target.value }))
          }
          className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>

      {state?.error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Invoice layout saved. New PDFs and emails will use these settings.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save invoice layout"}
      </button>
    </form>
  );
}
