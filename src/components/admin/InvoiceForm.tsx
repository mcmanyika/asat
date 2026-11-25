"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/admin/format";
import type { InvoiceItemInput, InvoiceWithItems } from "@/lib/admin/types";
import {
  createInvoice,
  updateInvoice,
} from "@/lib/admin/invoice-actions";

type LineDraft = InvoiceItemInput & { key: string };

function emptyLine(): LineDraft {
  return {
    key: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unit_price: 0,
  };
}

type InvoiceFormProps = {
  mode: "create" | "edit";
  invoice?: InvoiceWithItems;
  enquiryId?: string | null;
  locked?: boolean;
  defaultCurrency?: string;
  defaultTaxRate?: number;
};

export function InvoiceForm({
  mode,
  invoice,
  enquiryId,
  locked = false,
  defaultCurrency = "USD",
  defaultTaxRate = 0,
}: InvoiceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();
  const [lines, setLines] = useState<LineDraft[]>(
    invoice?.items.length
      ? invoice.items.map((item) => ({
          key: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      : [emptyLine()],
  );
  const [taxRate, setTaxRate] = useState(
    invoice?.tax_rate ?? defaultTaxRate,
  );
  const currency = invoice?.currency || defaultCurrency;

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, line) =>
        sum + (Number(line.quantity) || 0) * (Number(line.unit_price) || 0),
      0,
    );
    const taxAmount = Math.round(subtotal * (Number(taxRate) || 0)) / 100;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round((subtotal + taxAmount) * 100) / 100,
    };
  }, [lines, taxRate]);

  function updateLine(key: string, patch: Partial<LineDraft>) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  }

  function onSubmit(formData: FormData) {
    setError(null);
    setOk(false);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createInvoice(formData)
          : await updateInvoice(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (mode === "edit") setOk(true);
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={onSubmit} className="space-y-6">
      {invoice ? <input type="hidden" name="id" value={invoice.id} /> : null}
      {enquiryId ? (
        <input type="hidden" name="enquiry_id" value={enquiryId} />
      ) : invoice?.enquiry_id ? (
        <input type="hidden" name="enquiry_id" value={invoice.enquiry_id} />
      ) : null}

      <section className="grid gap-4 border border-border bg-white p-5 shadow-sm md:grid-cols-2">
        <h2 className="md:col-span-2 text-sm font-semibold tracking-wide text-secondary-text uppercase">
          Customer
        </h2>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Name
          </span>
          <input
            name="customer_name"
            required
            disabled={locked}
            defaultValue={invoice?.customer_name || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Email
          </span>
          <input
            type="email"
            name="customer_email"
            required
            disabled={locked}
            defaultValue={invoice?.customer_email || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Company
          </span>
          <input
            name="customer_company"
            disabled={locked}
            defaultValue={invoice?.customer_company || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Phone
          </span>
          <input
            name="customer_phone"
            disabled={locked}
            defaultValue={invoice?.customer_phone || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block font-medium text-primary-text">
            Address
          </span>
          <textarea
            name="customer_address"
            rows={2}
            disabled={locked}
            defaultValue={invoice?.customer_address || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
      </section>

      <section className="grid gap-4 border border-border bg-white p-5 shadow-sm md:grid-cols-4">
        <h2 className="md:col-span-4 text-sm font-semibold tracking-wide text-secondary-text uppercase">
          Invoice details
        </h2>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Issue date
          </span>
          <input
            type="date"
            name="issue_date"
            required
            disabled={locked}
            defaultValue={invoice?.issue_date || today}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Due date
          </span>
          <input
            type="date"
            name="due_date"
            disabled={locked}
            defaultValue={invoice?.due_date || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Currency
          </span>
          <input
            name="currency"
            disabled={locked}
            defaultValue={currency}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-primary-text">
            Tax rate (%)
          </span>
          <input
            type="number"
            name="tax_rate"
            min={0}
            step="0.001"
            disabled={locked}
            value={taxRate}
            onChange={(event) => setTaxRate(Number(event.target.value) || 0)}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
        <label className="block text-sm md:col-span-4">
          <span className="mb-1.5 block font-medium text-primary-text">
            Notes
          </span>
          <textarea
            name="notes"
            rows={3}
            disabled={locked}
            defaultValue={invoice?.notes || ""}
            className="w-full rounded-[4px] border border-border px-3 py-2.5 outline-none focus:border-gold disabled:bg-slate-50"
          />
        </label>
      </section>

      <section className="border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-secondary-text uppercase">
            Line items
          </h2>
          {!locked ? (
            <button
              type="button"
              onClick={() => setLines((prev) => [...prev, emptyLine()])}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-blue hover:text-gold-dark"
            >
              <Plus className="size-4" aria-hidden />
              Add line
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.key}
              className="grid gap-3 border border-border p-3 md:grid-cols-[1fr_100px_120px_auto]"
            >
              <input
                name="item_description"
                placeholder="Description"
                required
                disabled={locked}
                value={line.description}
                onChange={(event) =>
                  updateLine(line.key, { description: event.target.value })
                }
                className="rounded-[4px] border border-border px-3 py-2 text-sm outline-none focus:border-gold disabled:bg-slate-50"
              />
              <input
                type="number"
                name="item_quantity"
                min={0.001}
                step="0.001"
                required
                disabled={locked}
                value={line.quantity}
                onChange={(event) =>
                  updateLine(line.key, {
                    quantity: Number(event.target.value) || 0,
                  })
                }
                className="rounded-[4px] border border-border px-3 py-2 text-sm outline-none focus:border-gold disabled:bg-slate-50"
              />
              <input
                type="number"
                name="item_unit_price"
                min={0}
                step="0.01"
                required
                disabled={locked}
                value={line.unit_price}
                onChange={(event) =>
                  updateLine(line.key, {
                    unit_price: Number(event.target.value) || 0,
                  })
                }
                className="rounded-[4px] border border-border px-3 py-2 text-sm outline-none focus:border-gold disabled:bg-slate-50"
              />
              {!locked ? (
                <button
                  type="button"
                  aria-label="Remove line"
                  disabled={lines.length <= 1}
                  onClick={() =>
                    setLines((prev) =>
                      prev.filter((item) => item.key !== line.key),
                    )
                  }
                  className="inline-flex items-center justify-center text-secondary-text hover:text-red-700 disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>

        <dl className="mt-5 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between gap-6">
            <dt className="text-secondary-text">Subtotal</dt>
            <dd className="font-medium text-primary-text">
              {formatMoney(totals.subtotal, currency)}
            </dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-secondary-text">Tax</dt>
            <dd className="font-medium text-primary-text">
              {formatMoney(totals.taxAmount, currency)}
            </dd>
          </div>
          <div className="flex justify-between gap-6 border-t border-border pt-2 text-base">
            <dt className="font-semibold text-primary-text">Total</dt>
            <dd className="font-bold text-primary-text">
              {formatMoney(totals.total, currency)}
            </dd>
          </div>
        </dl>
      </section>

      {error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Invoice saved.
        </p>
      ) : null}

      {!locked ? (
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create invoice"
              : "Save changes"}
        </button>
      ) : null}
    </form>
  );
}
