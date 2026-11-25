"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffUser } from "@/lib/admin/auth";
import {
  allocateInvoiceNumber,
  computeInvoiceTotals,
  getInvoiceById,
} from "@/lib/admin/invoices";
import type { InvoiceItemInput, InvoiceStatus } from "@/lib/admin/types";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

function parseItems(formData: FormData): InvoiceItemInput[] {
  const descriptions = formData.getAll("item_description").map(String);
  const quantities = formData.getAll("item_quantity").map(String);
  const prices = formData.getAll("item_unit_price").map(String);

  const items: InvoiceItemInput[] = [];
  for (let i = 0; i < descriptions.length; i += 1) {
    const description = descriptions[i]?.trim();
    if (!description) continue;
    const quantity = Number(quantities[i] || 1);
    const unit_price = Number(prices[i] || 0);
    if (!(quantity > 0)) continue;
    items.push({
      description,
      quantity,
      unit_price: Number.isFinite(unit_price) ? unit_price : 0,
    });
  }
  return items;
}

function parseInvoiceFields(formData: FormData) {
  return {
    customer_name: String(formData.get("customer_name") || "").trim(),
    customer_email: String(formData.get("customer_email") || "")
      .trim()
      .toLowerCase(),
    customer_company:
      String(formData.get("customer_company") || "").trim() || null,
    customer_phone:
      String(formData.get("customer_phone") || "").trim() || null,
    customer_address:
      String(formData.get("customer_address") || "").trim() || null,
    issue_date: String(formData.get("issue_date") || "").trim(),
    due_date: String(formData.get("due_date") || "").trim() || null,
    currency: String(formData.get("currency") || "USD").trim() || "USD",
    tax_rate: Number(formData.get("tax_rate") || 0),
    notes: String(formData.get("notes") || "").trim() || null,
    enquiry_id: String(formData.get("enquiry_id") || "").trim() || null,
  };
}

function validateInvoiceInput(
  fields: ReturnType<typeof parseInvoiceFields>,
  items: InvoiceItemInput[],
) {
  if (!fields.customer_name) return "Customer name is required.";
  if (!fields.customer_email) return "Customer email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.customer_email)) {
    return "Customer email is invalid.";
  }
  if (!fields.issue_date) return "Issue date is required.";
  if (items.length === 0) return "Add at least one line item.";
  if (Number.isNaN(fields.tax_rate) || fields.tax_rate < 0) {
    return "Tax rate must be zero or greater.";
  }
  return null;
}

export async function createInvoice(formData: FormData) {
  const staff = await requireStaffUser();
  const fields = parseInvoiceFields(formData);
  const items = parseItems(formData);
  const validationError = validateInvoiceInput(fields, items);
  if (validationError) return { error: validationError };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const number = await allocateInvoiceNumber();
  if (!number) {
    return {
      error:
        "Could not allocate invoice number. Run supabase/invoices.sql in Supabase.",
    };
  }

  const totals = computeInvoiceTotals(items, fields.tax_rate);

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      number,
      status: "draft",
      ...fields,
      tax_rate: fields.tax_rate,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
      created_by: staff.id,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !invoice) {
    return {
      error:
        error?.message.includes("does not exist") || error?.code === "42P01"
          ? "Invoices table missing. Run supabase/invoices.sql in the Supabase SQL Editor."
          : error?.message || "Failed to create invoice.",
    };
  }

  const itemRows = items.map((item, index) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: Math.round(item.quantity * item.unit_price * 100) / 100,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemRows);

  if (itemsError) {
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { error: itemsError.message };
  }

  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}

export async function updateInvoice(formData: FormData) {
  await requireStaffUser();
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Invoice id is required." };

  const existing = await getInvoiceById(id);
  if (!existing) return { error: "Invoice not found." };
  if (existing.status === "void" || existing.status === "paid") {
    return { error: "Paid or void invoices cannot be edited." };
  }

  const fields = parseInvoiceFields(formData);
  const items = parseItems(formData);
  const validationError = validateInvoiceInput(fields, items);
  if (validationError) return { error: validationError };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const totals = computeInvoiceTotals(items, fields.tax_rate);

  const { error } = await supabase
    .from("invoices")
    .update({
      ...fields,
      tax_rate: fields.tax_rate,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("invoice_items").delete().eq("invoice_id", id);

  const itemRows = items.map((item, index) => ({
    invoice_id: id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: Math.round(item.quantity * item.unit_price * 100) / 100,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemRows);

  if (itemsError) return { error: itemsError.message };

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  return { ok: true as const };
}

export async function updateInvoiceStatus(formData: FormData) {
  await requireStaffUser();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as InvoiceStatus;

  if (!id) return { error: "Invoice id is required." };
  if (!["draft", "sent", "paid", "void"].includes(status)) {
    return { error: "Invalid status." };
  }

  const existing = await getInvoiceById(id);
  if (!existing) return { error: "Invoice not found." };

  if (existing.status === "void") {
    return { error: "Void invoices cannot change status." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("invoices")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  return { ok: true as const };
}

export async function emailInvoice(formData: FormData) {
  try {
    await requireStaffUser();
    const id = String(formData.get("id") || "");
    if (!id) return { error: "Invoice id is required." };

    const invoice = await getInvoiceById(id);
    if (!invoice) return { error: "Invoice not found." };
    if (invoice.status === "void") {
      return { error: "Cannot email a void invoice." };
    }
    if (!invoice.customer_email?.trim()) {
      return { error: "Customer email is required before sending." };
    }

    const { sendInvoiceEmail } = await import("@/lib/email/invoice-email");
    const result = await sendInvoiceEmail(invoice);
    if (!result.ok) {
      return {
        error: "error" in result ? result.error : "Failed to send email.",
      };
    }

    if (invoice.status === "draft") {
      const supabase = await createSupabaseAuthServerClient();
      if (supabase) {
        await supabase
          .from("invoices")
          .update({
            status: "sent",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
      }
    }

    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${id}`);
    return { ok: true as const };
  } catch (error) {
    console.error("emailInvoice failed:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to email invoice.",
    };
  }
}
