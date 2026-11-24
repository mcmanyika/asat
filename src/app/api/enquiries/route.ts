import { enquirySchema } from "@/lib/validations/enquiry";
import { saveEnquiry } from "@/lib/supabase/enquiries";
import { z } from "zod";

const requestSchema = enquirySchema.extend({
  type: z.enum(["contact", "quote", "demo", "consultation"]),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid enquiry payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const values = parsed.data;
  const result = await saveEnquiry({
    type: values.type,
    full_name: values.fullName,
    company_name: values.companyName,
    email: values.email,
    telephone: values.telephone,
    interest: values.interest,
    subject: values.subject?.trim() || null,
    message: values.message,
    privacy_consent: values.privacyConsent,
    source: "website",
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 503 });
  }

  return Response.json({
    success: true,
    id: result.id,
  });
}
