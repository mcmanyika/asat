import "server-only";

import { siteConfig } from "@/config/site";
import {
  getEnquiryNotifyEmails,
  isEmailConfigured,
} from "@/lib/email/config";
import { sendEmail } from "@/lib/email/send";
import type { EnquiryInsert } from "@/lib/supabase/server";

function formatLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function notifyStaffOfEnquiry(
  enquiry: EnquiryInsert & { id: string },
) {
  if (!(await isEmailConfigured())) {
    console.warn(
      "Enquiry email skipped: set RESEND_API_KEY and configure notify emails in Admin → Settings (or ENQUIRY_NOTIFY_EMAILS).",
    );
    return { ok: false as const, skipped: true as const };
  }

  const recipients = await getEnquiryNotifyEmails();
  const typeLabel = formatLabel(enquiry.type);
  const interestLabel = formatLabel(enquiry.interest);
  const sourceLabel = formatLabel(enquiry.source || "website");
  const adminUrl = `${siteConfig.url.replace(/\/$/, "")}/admin/enquiries/${enquiry.id}`;

  const subject =
    enquiry.subject?.trim() ||
    `New ${typeLabel} enquiry from ${enquiry.full_name}`;

  const text = [
    `New ${typeLabel} enquiry received via ${sourceLabel}.`,
    "",
    `Name: ${enquiry.full_name}`,
    `Company: ${enquiry.company_name}`,
    `Email: ${enquiry.email}`,
    `Telephone: ${enquiry.telephone}`,
    `Interest: ${interestLabel}`,
    enquiry.subject ? `Subject: ${enquiry.subject}` : null,
    "",
    "Message:",
    enquiry.message,
    "",
    `Open in dashboard: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Manrope, Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2 style="margin: 0 0 12px; font-size: 20px;">New ${escapeHtml(typeLabel)} enquiry</h2>
      <p style="margin: 0 0 16px; color: #64748b;">
        Received via ${escapeHtml(sourceLabel)} on ${escapeHtml(siteConfig.name)}.
      </p>
      <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px;">Name</td>
          <td style="padding: 6px 0; font-weight: 600;">${escapeHtml(enquiry.full_name)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Company</td>
          <td style="padding: 6px 0;">${escapeHtml(enquiry.company_name)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Email</td>
          <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Telephone</td>
          <td style="padding: 6px 0;"><a href="tel:${escapeHtml(enquiry.telephone.replace(/\s+/g, ""))}">${escapeHtml(enquiry.telephone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Interest</td>
          <td style="padding: 6px 0;">${escapeHtml(interestLabel)}</td>
        </tr>
        ${
          enquiry.subject
            ? `<tr>
          <td style="padding: 6px 0; color: #64748b;">Subject</td>
          <td style="padding: 6px 0;">${escapeHtml(enquiry.subject)}</td>
        </tr>`
            : ""
        }
      </table>
      <div style="margin-top: 18px; padding: 14px; background: #f7f5f0; border: 1px solid #e8e4dc;">
        <p style="margin: 0 0 8px; font-weight: 600;">Message</p>
        <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(enquiry.message)}</p>
      </div>
      <p style="margin: 20px 0 0;">
        <a href="${escapeHtml(adminUrl)}" style="display: inline-block; background: #0b1628; color: #ffffff; text-decoration: none; padding: 10px 14px; font-weight: 600;">
          Open in staff dashboard
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    to: recipients,
    subject: `[ASAT] ${subject}`,
    html,
    text,
    replyTo: enquiry.email,
  });
}
