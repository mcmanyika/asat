import { siteConfig } from "@/config/site";

export const INVOICE_LAYOUT_KEY = "invoice_layout";

export type InvoiceHeaderStyle = "stacked" | "split";

export type InvoiceLayoutSettings = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  documentTitle: string;
  accentColor: string;
  logoPath: string;
  showLogo: boolean;
  headerStyle: InvoiceHeaderStyle;
  showStatus: boolean;
  showDueDate: boolean;
  showTax: boolean;
  footerNote: string;
  defaultCurrency: string;
  defaultTaxRate: number;
};

export const DEFAULT_INVOICE_LAYOUT: InvoiceLayoutSettings = {
  companyName: siteConfig.name,
  companyEmail: siteConfig.contact.email || "",
  companyPhone: siteConfig.contact.phone || "",
  companyAddress: siteConfig.contact.address || "",
  documentTitle: "INVOICE",
  accentColor: "#0B1628",
  logoPath: siteConfig.logo,
  showLogo: true,
  headerStyle: "split",
  showStatus: true,
  showDueDate: true,
  showTax: true,
  footerNote: "Thank you for your business.",
  defaultCurrency: "USD",
  defaultTaxRate: 0,
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseInvoiceLayout(
  raw: string | null | undefined,
): InvoiceLayoutSettings {
  const next = { ...DEFAULT_INVOICE_LAYOUT };
  if (!raw?.trim()) return next;

  try {
    const parsed = JSON.parse(raw) as Partial<InvoiceLayoutSettings>;
    next.companyName = asString(parsed.companyName, next.companyName).trim() || next.companyName;
    next.companyEmail = asString(parsed.companyEmail, next.companyEmail).trim();
    next.companyPhone = asString(parsed.companyPhone, next.companyPhone).trim();
    next.companyAddress = asString(
      parsed.companyAddress,
      next.companyAddress,
    ).trim();
    next.documentTitle =
      asString(parsed.documentTitle, next.documentTitle).trim() || "INVOICE";
    next.accentColor = normalizeHex(
      asString(parsed.accentColor, next.accentColor),
      next.accentColor,
    );
    next.logoPath =
      asString(parsed.logoPath, next.logoPath).trim() || next.logoPath;
    next.showLogo = asBoolean(parsed.showLogo, next.showLogo);
    next.headerStyle =
      parsed.headerStyle === "stacked" || parsed.headerStyle === "split"
        ? parsed.headerStyle
        : next.headerStyle;
    next.showStatus = asBoolean(parsed.showStatus, next.showStatus);
    next.showDueDate = asBoolean(parsed.showDueDate, next.showDueDate);
    next.showTax = asBoolean(parsed.showTax, next.showTax);
    next.footerNote = asString(parsed.footerNote, next.footerNote);
    next.defaultCurrency =
      asString(parsed.defaultCurrency, next.defaultCurrency).trim() || "USD";
    next.defaultTaxRate = Math.max(
      0,
      asNumber(parsed.defaultTaxRate, next.defaultTaxRate),
    );
  } catch {
    return next;
  }

  return next;
}

export function normalizeHex(value: string, fallback: string) {
  const raw = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^[0-9A-Fa-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
  return fallback;
}

export function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex, "#0B1628").slice(1);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16) / 255,
    g: Number.parseInt(normalized.slice(2, 4), 16) / 255,
    b: Number.parseInt(normalized.slice(4, 6), 16) / 255,
  };
}
