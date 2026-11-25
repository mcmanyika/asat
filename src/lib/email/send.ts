import "server-only";

import { Resend } from "resend";
import { getEmailFromAddress } from "@/lib/email/config";

type SendEmailInput = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false as const,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  if (input.to.length === 0) {
    return {
      ok: false as const,
      error: "No recipient emails provided.",
    };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    console.error("Resend email failed:", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data?.id };
}
