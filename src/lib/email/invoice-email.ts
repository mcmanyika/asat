import "server-only";

import { siteConfig } from "@/config/site";
import { formatDate, formatMoney } from "@/lib/admin/format";
import { sendEmail } from "@/lib/email/send";
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

  let pdf: Buffer | null = null;
  try {
    const { buildInvoicePdf } = await import("@/lib/invoices/pdf");
    pdf = await buildInvoicePdf(invoice);
  } catch (error) {
    console.error("Invoice PDF generation failed:", error);
  }

  const currency = invoice.currency || "USD";
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

  const subject = `Invoice ${invoice.number} from ${siteConfig.name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0B1628;line-height:1.5;">
      <p>Hello ${escapeHtml(invoice.customer_name)},</p>
      <p>${
        pdf
          ? `Please find invoice <strong>${escapeHtml(invoice.number)}</strong> attached.`
          : `Here are the details for invoice <strong>${escapeHtml(invoice.number)}</strong>.`
      }</p>
      <p>
        Issue date: ${escapeHtml(formatDate(invoice.issue_date))}<br/>
        Due date: ${escapeHtml(formatDate(invoice.due_date))}<br/>
        Total due: <strong>${escapeHtml(formatMoney(invoice.total, currency))}</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #cbd5e1;">Description</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1;">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1;">Unit</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p>If you have any questions, reply to this email or contact ${escapeHtml(siteConfig.contact.email || siteConfig.name)}.</p>
      <p>Thank you,<br/>${escapeHtml(siteConfig.name)}</p>
    </div>
  `;

  const text = [
    `Hello ${invoice.customer_name},`,
    "",
    `Invoice ${invoice.number}`,
    `Issue date: ${formatDate(invoice.issue_date)}`,
    `Due date: ${formatDate(invoice.due_date)}`,
    `Total due: ${formatMoney(invoice.total, currency)}`,
    "",
    `Thank you,`,
    siteConfig.name,
  ].join("\n");

  return sendEmail({
    to: [email],
    subject,
    html,
    text,
    replyTo: siteConfig.contact.email || undefined,
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
