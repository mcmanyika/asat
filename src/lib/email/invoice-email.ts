import "server-only";

import { formatDate, formatMoney } from "@/lib/admin/format";
import { sendEmail } from "@/lib/email/send";
import { getInvoiceLayout } from "@/lib/invoices/layout";
import type { InvoiceWithItems } from "@/lib/admin/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendInvoiceEmail(invoice: InvoiceWithItems) {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return {
      ok: false as const,
      error: "Email is not configured. Set RESEND_API_KEY to send invoices.",
    };
  }

  const email = invoice.customer_email?.trim();
  if (!email) {
    return { ok: false as const, error: "Customer email is required." };
  }

  const layout = await getInvoiceLayout();

  let pdf: Buffer | null = null;
  try {
    const { buildInvoicePdf } = await import("@/lib/invoices/pdf");
    pdf = await buildInvoicePdf(invoice, layout);
  } catch (error) {
    console.error("Invoice PDF generation failed:", error);
  }

  const currency = invoice.currency || layout.defaultCurrency || "USD";
  const rows = invoice.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.description)}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(formatMoney(item.unit_price, currency))}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(formatMoney(item.line_total, currency))}</td>
        </tr>`,
    )
    .join("");

  const subject = `${layout.documentTitle || "Invoice"} ${invoice.number} from ${layout.companyName}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0B1628;line-height:1.5;">
      <div style="border-top:6px solid ${escapeHtml(layout.accentColor)};padding-top:12px;margin-bottom:16px;">
        <strong style="color:${escapeHtml(layout.accentColor)};">${escapeHtml(layout.companyName)}</strong>
      </div>
      <p>Hello ${escapeHtml(invoice.customer_name)},</p>
      <p>${
        pdf
          ? `Please find ${escapeHtml(layout.documentTitle.toLowerCase())} <strong>${escapeHtml(invoice.number)}</strong> attached.`
          : `Here are the details for ${escapeHtml(layout.documentTitle.toLowerCase())} <strong>${escapeHtml(invoice.number)}</strong>.`
      }</p>
      <p>
        Issue date: ${escapeHtml(formatDate(invoice.issue_date))}<br/>
        ${
          layout.showDueDate
            ? `Due date: ${escapeHtml(formatDate(invoice.due_date))}<br/>`
            : ""
        }
        Total due: <strong>${escapeHtml(formatMoney(invoice.total, currency))}</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid ${escapeHtml(layout.accentColor)};">Description</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid ${escapeHtml(layout.accentColor)};">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid ${escapeHtml(layout.accentColor)};">Unit</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid ${escapeHtml(layout.accentColor)};">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p>If you have any questions, reply to this email or contact ${escapeHtml(layout.companyEmail || layout.companyName)}.</p>
      ${
        layout.footerNote?.trim()
          ? `<p style="color:#64748b;">${escapeHtml(layout.footerNote)}</p>`
          : ""
      }
      <p>Thank you,<br/>${escapeHtml(layout.companyName)}</p>
    </div>
  `;

  const text = [
    `Hello ${invoice.customer_name},`,
    "",
    `${layout.documentTitle} ${invoice.number}`,
    `Issue date: ${formatDate(invoice.issue_date)}`,
    layout.showDueDate ? `Due date: ${formatDate(invoice.due_date)}` : null,
    `Total due: ${formatMoney(invoice.total, currency)}`,
    "",
    layout.footerNote?.trim() || null,
    `Thank you,`,
    layout.companyName,
  ]
    .filter(Boolean)
    .join("\n");

  return sendEmail({
    to: [email],
    subject,
    html,
    text,
    replyTo: layout.companyEmail || undefined,
    attachments: pdf
      ? [
          {
            filename: `${invoice.number}.pdf`,
            content: pdf,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  });
}
