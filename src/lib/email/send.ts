import "server-only";

import { Resend } from "resend";
import { getEmailFromAddress } from "@/lib/email/config";

type SendEmailAttachment = {
  filename: string;
  content: Buffer | Uint8Array | string;
  contentType?: string;
};

type SendEmailInput = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: SendEmailAttachment[];
};

function toBase64(content: Buffer | Uint8Array | string) {
  if (typeof content === "string") return content;
  return Buffer.from(content).toString("base64");
}

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

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: getEmailFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments?.map((file) => ({
        filename: file.filename,
        content: toBase64(file.content),
        contentType: file.contentType,
      })),
    });

    if (error) {
      console.error("Resend email failed:", error);
      const message = error.message || "Failed to send email.";
      if (
        message.toLowerCase().includes("only send testing emails") ||
        message.toLowerCase().includes("verify a domain")
      ) {
        return {
          ok: false as const,
          error:
            `${message} With onboarding@resend.dev you can only email your own Resend account address until a domain is verified.`,
        };
      }
      return { ok: false as const, error: message };
    }

    return { ok: true as const, id: data?.id };
  } catch (error) {
    console.error("Resend email threw:", error);
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Failed to send email.",
    };
  }
}
