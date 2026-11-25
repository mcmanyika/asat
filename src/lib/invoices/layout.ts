import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_INVOICE_LAYOUT,
  INVOICE_LAYOUT_KEY,
  parseInvoiceLayout,
  type InvoiceLayoutSettings,
} from "@/lib/invoices/layout-shared";

export {
  DEFAULT_INVOICE_LAYOUT,
  INVOICE_LAYOUT_KEY,
  hexToRgb,
  parseInvoiceLayout,
  type InvoiceHeaderStyle,
  type InvoiceLayoutSettings,
} from "@/lib/invoices/layout-shared";

async function loadInvoiceLayout(): Promise<InvoiceLayoutSettings> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return DEFAULT_INVOICE_LAYOUT;

  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", INVOICE_LAYOUT_KEY)
    .maybeSingle();

  if (error) {
    console.error("[invoice-layout] failed to load:", error.message);
    return DEFAULT_INVOICE_LAYOUT;
  }

  return parseInvoiceLayout(data?.value);
}

export async function getInvoiceLayout(): Promise<InvoiceLayoutSettings> {
  "use cache";
  cacheTag("invoice-layout");
  cacheLife("hours");
  return loadInvoiceLayout();
}

export async function getInvoiceLayoutFresh(): Promise<InvoiceLayoutSettings> {
  return loadInvoiceLayout();
}
