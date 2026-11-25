import "server-only";

import { connection } from "next/server";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
  InvoiceItemInput,
  InvoiceItemRow,
  InvoiceRow,
  InvoiceStatus,
  InvoiceWithItems,
} from "@/lib/admin/types";

async function getAdminSupabase() {
  await connection();
  return createSupabaseAuthServerClient();
}

export function computeInvoiceTotals(
  items: InvoiceItemInput[],
  taxRate: number,
) {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    return sum + qty * price;
  }, 0);
  const rate = Number(taxRate) || 0;
  const taxAmount = Math.round(subtotal * rate) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total,
  };
}

function mapInvoice(row: Record<string, unknown>): InvoiceRow {
  return {
    id: String(row.id),
    number: String(row.number),
    status: row.status as InvoiceStatus,
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_company: (row.customer_company as string | null) ?? null,
    customer_phone: (row.customer_phone as string | null) ?? null,
    customer_address: (row.customer_address as string | null) ?? null,
    issue_date: String(row.issue_date),
    due_date: (row.due_date as string | null) ?? null,
    currency: String(row.currency || "USD"),
    tax_rate: Number(row.tax_rate) || 0,
    notes: (row.notes as string | null) ?? null,
    enquiry_id: (row.enquiry_id as string | null) ?? null,
    subtotal: Number(row.subtotal) || 0,
    tax_amount: Number(row.tax_amount) || 0,
    total: Number(row.total) || 0,
    created_by: (row.created_by as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapItem(row: Record<string, unknown>): InvoiceItemRow {
  return {
    id: String(row.id),
    invoice_id: String(row.invoice_id),
    description: String(row.description),
    quantity: Number(row.quantity) || 0,
    unit_price: Number(row.unit_price) || 0,
    line_total: Number(row.line_total) || 0,
    sort_order: Number(row.sort_order) || 0,
  };
}

function sanitizeSearch(value?: string) {
  return (value || "").trim().replace(/[%_,]/g, " ").replace(/\s+/g, " ").trim();
}

const invoiceSortOptions: Record<
  string,
  { column: string; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  number_asc: { column: "number", ascending: true },
  number_desc: { column: "number", ascending: false },
  customer_asc: { column: "customer_name", ascending: true },
  customer_desc: { column: "customer_name", ascending: false },
  issue_newest: { column: "issue_date", ascending: false },
  issue_oldest: { column: "issue_date", ascending: true },
  total_desc: { column: "total", ascending: false },
  total_asc: { column: "total", ascending: true },
  status: { column: "status", ascending: true },
};

export async function listInvoices(filters?: {
  q?: string;
  status?: string;
  sort?: string;
}): Promise<InvoiceRow[]> {
  const supabase = await getAdminSupabase();
  if (!supabase) return [];

  const sort =
    (filters?.sort && invoiceSortOptions[filters.sort]) ||
    invoiceSortOptions.newest;

  let query = supabase.from("invoices").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const q = sanitizeSearch(filters?.q);
  if (q) {
    query = query.or(
      `number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_email.ilike.%${q}%,customer_company.ilike.%${q}%`,
    );
  }

  const { data, error } = await query.order(sort.column, {
    ascending: sort.ascending,
  });
  if (error) {
    console.error("[invoices] list failed:", error.message);
    return [];
  }

  return (data || []).map((row) => mapInvoice(row as Record<string, unknown>));
}

export async function getInvoiceById(
  id: string,
): Promise<InvoiceWithItems | null> {
  const supabase = await getAdminSupabase();
  if (!supabase) return null;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !invoice) {
    if (error) console.error("[invoices] get failed:", error.message);
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order", { ascending: true });

  if (itemsError) {
    console.error("[invoices] items failed:", itemsError.message);
  }

  return {
    ...mapInvoice(invoice as Record<string, unknown>),
    items: (items || []).map((row) =>
      mapItem(row as Record<string, unknown>),
    ),
  };
}

export async function allocateInvoiceNumber(): Promise<string | null> {
  const supabase = await getAdminSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("next_invoice_number");
  if (error) {
    console.error("[invoices] number allocation failed:", error.message);
    return null;
  }

  return typeof data === "string" ? data : null;
}
