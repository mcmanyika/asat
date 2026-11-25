import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { siteConfig } from "@/config/site";
import { formatDate, formatMoney } from "@/lib/admin/format";
import type { InvoiceWithItems } from "@/lib/admin/types";

/** Helvetica/WinAnsi cannot encode many Unicode glyphs. */
function pdfSafe(value: string) {
  return value
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("…", "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

export async function buildInvoicePdf(
  invoice: InvoiceWithItems,
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const pageSize = { width: 595.28, height: 841.89 };
  let page = doc.addPage([pageSize.width, pageSize.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const currency = invoice.currency || "USD";
  const margin = 50;
  let y = pageSize.height - margin;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = doc.addPage([pageSize.width, pageSize.height]);
      y = pageSize.height - margin;
    }
  };

  const drawText = (
    text: string,
    x: number,
    size: number,
    options?: {
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      maxWidth?: number;
    },
  ) => {
    const usedFont = options?.bold ? fontBold : font;
    const color = options?.color ?? rgb(0.04, 0.09, 0.16);
    const maxWidth = options?.maxWidth ?? pageSize.width - margin - x;
    const safe = pdfSafe(text || "");
    const words = safe.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = "";

    for (const word of words.length ? words : [""]) {
      const next = current ? `${current} ${word}` : word;
      if (usedFont.widthOfTextAtSize(next, size) <= maxWidth) {
        current = next;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current || lines.length === 0) lines.push(current);

    for (const line of lines) {
      ensureSpace(size + 4);
      page.drawText(line, {
        x,
        y: y - size,
        size,
        font: usedFont,
        color,
      });
      y -= size + 4;
    }

    return lines.length;
  };

  drawText(siteConfig.name, margin, 18, { bold: true });
  if (siteConfig.contact.email) {
    drawText(siteConfig.contact.email, margin, 10, {
      color: rgb(0.39, 0.45, 0.55),
    });
  }
  if (siteConfig.contact.phone) {
    drawText(siteConfig.contact.phone, margin, 10, {
      color: rgb(0.39, 0.45, 0.55),
    });
  }

  y -= 8;
  drawText("INVOICE", margin, 20, { bold: true });
  drawText(invoice.number, margin, 11, { color: rgb(0.2, 0.25, 0.33) });
  drawText(`Status: ${invoice.status.toUpperCase()}`, margin, 11, {
    color: rgb(0.2, 0.25, 0.33),
  });

  y -= 10;
  drawText("Bill to", margin, 11, { bold: true });
  drawText(invoice.customer_name, margin, 10);
  if (invoice.customer_company) drawText(invoice.customer_company, margin, 10);
  drawText(invoice.customer_email, margin, 10);
  if (invoice.customer_phone) drawText(invoice.customer_phone, margin, 10);
  if (invoice.customer_address) {
    drawText(invoice.customer_address, margin, 10, { maxWidth: 360 });
  }

  y -= 8;
  drawText(`Issue date: ${formatDate(invoice.issue_date)}`, margin, 10);
  drawText(`Due date: ${formatDate(invoice.due_date)}`, margin, 10);

  y -= 12;
  ensureSpace(24);
  const headerY = y;
  page.drawText("Description", {
    x: margin,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: rgb(0.39, 0.45, 0.55),
  });
  page.drawText("Qty", {
    x: 320,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: rgb(0.39, 0.45, 0.55),
  });
  page.drawText("Unit", {
    x: 380,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: rgb(0.39, 0.45, 0.55),
  });
  page.drawText("Total", {
    x: 460,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: rgb(0.39, 0.45, 0.55),
  });
  y = headerY - 16;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize.width - margin, y },
    thickness: 1,
    color: rgb(0.89, 0.91, 0.94),
  });
  y -= 12;

  for (const item of invoice.items) {
    ensureSpace(36);
    const rowTop = y;
    const description = pdfSafe(item.description);
    drawText(description, margin, 10, { maxWidth: 250 });
    const rowBottom = y;
    y = rowTop;
    page.drawText(pdfSafe(String(item.quantity)), {
      x: 320,
      y: rowTop - 10,
      size: 10,
      font,
      color: rgb(0.04, 0.09, 0.16),
    });
    page.drawText(pdfSafe(formatMoney(item.unit_price, currency)), {
      x: 380,
      y: rowTop - 10,
      size: 10,
      font,
      color: rgb(0.04, 0.09, 0.16),
    });
    page.drawText(pdfSafe(formatMoney(item.line_total, currency)), {
      x: 460,
      y: rowTop - 10,
      size: 10,
      font,
      color: rgb(0.04, 0.09, 0.16),
    });
    y = Math.min(rowBottom, rowTop - 18) - 8;
  }

  ensureSpace(70);
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize.width - margin, y },
    thickness: 1,
    color: rgb(0.89, 0.91, 0.94),
  });
  y -= 18;

  drawText(`Subtotal: ${formatMoney(invoice.subtotal, currency)}`, 320, 10);
  drawText(
    `Tax (${invoice.tax_rate}%): ${formatMoney(invoice.tax_amount, currency)}`,
    320,
    10,
  );
  drawText(`Total: ${formatMoney(invoice.total, currency)}`, 320, 12, {
    bold: true,
  });

  if (invoice.notes?.trim()) {
    y -= 12;
    drawText("Notes", margin, 11, { bold: true });
    drawText(invoice.notes, margin, 10, { maxWidth: 480 });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
