import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate, formatMoney } from "@/lib/admin/format";
import {
  getInvoiceLayout,
  hexToRgb,
  type InvoiceLayoutSettings,
} from "@/lib/invoices/layout";
import type { InvoiceWithItems } from "@/lib/admin/types";

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

async function loadLogoBytes(logoPath: string) {
  try {
    const relative = logoPath.replace(/^\//, "");
    const absolute = path.join(process.cwd(), "public", relative);
    return await readFile(absolute);
  } catch {
    return null;
  }
}

export async function buildInvoicePdf(
  invoice: InvoiceWithItems,
  layoutOverride?: InvoiceLayoutSettings,
): Promise<Buffer> {
  const layout = layoutOverride ?? (await getInvoiceLayout());
  const accent = hexToRgb(layout.accentColor);
  const accentColor = rgb(accent.r, accent.g, accent.b);

  const doc = await PDFDocument.create();
  const pageSize = { width: 595.28, height: 841.89 };
  let page = doc.addPage([pageSize.width, pageSize.height]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const currency = invoice.currency || layout.defaultCurrency || "USD";
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
      align?: "left" | "right";
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
      const width = usedFont.widthOfTextAtSize(line, size);
      const drawX =
        options?.align === "right" ? x + maxWidth - width : x;
      page.drawText(line, {
        x: drawX,
        y: y - size,
        size,
        font: usedFont,
        color,
      });
      y -= size + 4;
    }

    return lines.length;
  };

  // Accent bar
  page.drawRectangle({
    x: 0,
    y: pageSize.height - 8,
    width: pageSize.width,
    height: 8,
    color: accentColor,
  });

  const headerStart = y;
  let logoBottom = y;

  if (layout.showLogo) {
    const logoBytes = await loadLogoBytes(layout.logoPath);
    if (logoBytes) {
      try {
        const embedded =
          layout.logoPath.toLowerCase().endsWith(".png")
            ? await doc.embedPng(logoBytes)
            : await doc.embedJpg(logoBytes);
        const maxW = 120;
        const maxH = 48;
        const scale = Math.min(maxW / embedded.width, maxH / embedded.height);
        const w = embedded.width * scale;
        const h = embedded.height * scale;
        page.drawImage(embedded, {
          x: margin,
          y: y - h,
          width: w,
          height: h,
        });
        logoBottom = y - h - 8;
      } catch {
        // Ignore invalid logo files and continue with text header.
      }
    }
  }

  if (layout.headerStyle === "split") {
    y = headerStart;
    const rightWidth = 200;
    const rightX = pageSize.width - margin - rightWidth;
    drawText(layout.documentTitle || "INVOICE", rightX, 20, {
      bold: true,
      color: accentColor,
      maxWidth: rightWidth,
      align: "right",
    });
    drawText(invoice.number, rightX, 11, {
      color: rgb(0.2, 0.25, 0.33),
      maxWidth: rightWidth,
      align: "right",
    });
    if (layout.showStatus) {
      drawText(`Status: ${invoice.status.toUpperCase()}`, rightX, 11, {
        color: rgb(0.2, 0.25, 0.33),
        maxWidth: rightWidth,
        align: "right",
      });
    }
    const rightBottom = y;
    y = Math.min(logoBottom, rightBottom);
  } else {
    y = logoBottom;
  }

  drawText(layout.companyName, margin, 14, { bold: true, color: accentColor });
  if (layout.companyEmail) {
    drawText(layout.companyEmail, margin, 10, {
      color: rgb(0.39, 0.45, 0.55),
    });
  }
  if (layout.companyPhone) {
    drawText(layout.companyPhone, margin, 10, {
      color: rgb(0.39, 0.45, 0.55),
    });
  }
  if (layout.companyAddress) {
    drawText(layout.companyAddress, margin, 10, {
      color: rgb(0.39, 0.45, 0.55),
      maxWidth: 280,
    });
  }

  if (layout.headerStyle === "stacked") {
    y -= 8;
    drawText(layout.documentTitle || "INVOICE", margin, 20, {
      bold: true,
      color: accentColor,
    });
    drawText(invoice.number, margin, 11, { color: rgb(0.2, 0.25, 0.33) });
    if (layout.showStatus) {
      drawText(`Status: ${invoice.status.toUpperCase()}`, margin, 11, {
        color: rgb(0.2, 0.25, 0.33),
      });
    }
  }

  y -= 10;
  drawText("Bill to", margin, 11, { bold: true, color: accentColor });
  drawText(invoice.customer_name, margin, 10);
  if (invoice.customer_company) drawText(invoice.customer_company, margin, 10);
  drawText(invoice.customer_email, margin, 10);
  if (invoice.customer_phone) drawText(invoice.customer_phone, margin, 10);
  if (invoice.customer_address) {
    drawText(invoice.customer_address, margin, 10, { maxWidth: 360 });
  }

  y -= 8;
  drawText(`Issue date: ${formatDate(invoice.issue_date)}`, margin, 10);
  if (layout.showDueDate) {
    drawText(`Due date: ${formatDate(invoice.due_date)}`, margin, 10);
  }

  y -= 12;
  ensureSpace(24);
  const headerY = y;
  page.drawText("Description", {
    x: margin,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: accentColor,
  });
  page.drawText("Qty", {
    x: 320,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: accentColor,
  });
  page.drawText("Unit", {
    x: 380,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: accentColor,
  });
  page.drawText("Total", {
    x: 460,
    y: headerY - 10,
    size: 9,
    font: fontBold,
    color: accentColor,
  });
  y = headerY - 16;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize.width - margin, y },
    thickness: 1.5,
    color: accentColor,
  });
  y -= 12;

  for (const item of invoice.items) {
    ensureSpace(36);
    const rowTop = y;
    drawText(item.description, margin, 10, { maxWidth: 250 });
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

  ensureSpace(90);
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize.width - margin, y },
    thickness: 1,
    color: rgb(0.89, 0.91, 0.94),
  });
  y -= 18;

  drawText(`Subtotal: ${formatMoney(invoice.subtotal, currency)}`, 320, 10);
  if (layout.showTax) {
    drawText(
      `Tax (${invoice.tax_rate}%): ${formatMoney(invoice.tax_amount, currency)}`,
      320,
      10,
    );
  }
  drawText(`Total: ${formatMoney(invoice.total, currency)}`, 320, 12, {
    bold: true,
    color: accentColor,
  });

  if (invoice.notes?.trim()) {
    y -= 12;
    drawText("Notes", margin, 11, { bold: true, color: accentColor });
    drawText(invoice.notes, margin, 10, { maxWidth: 480 });
  }

  if (layout.footerNote?.trim()) {
    y -= 16;
    drawText(layout.footerNote, margin, 9, {
      color: rgb(0.39, 0.45, 0.55),
      maxWidth: 480,
    });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
