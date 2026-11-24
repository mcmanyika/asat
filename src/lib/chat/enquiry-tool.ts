import { z } from "zod";
import { interestAreas } from "@/lib/validations/enquiry";
import type { OpenAI } from "openai";

export const chatEnquiryToolSchema = z.object({
  type: z.enum(["contact", "quote", "demo", "consultation"]),
  fullName: z.string().trim().min(2).max(100),
  companyName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  telephone: z.string().trim().min(7).max(30),
  interest: z.enum(interestAreas),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(2000),
  privacyConsent: z.literal(true),
});

export type ChatEnquiryToolInput = z.infer<typeof chatEnquiryToolSchema>;

export const saveEnquiryTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "save_enquiry",
    description:
      "Save a completed website enquiry to the ASAT Technologies database after collecting all required contact details and explicit privacy consent.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: {
          type: "string",
          enum: ["contact", "quote", "demo", "consultation"],
          description: "Enquiry category based on what the visitor needs.",
        },
        fullName: {
          type: "string",
          description: "Visitor full name.",
        },
        companyName: {
          type: "string",
          description: "Visitor company name.",
        },
        email: {
          type: "string",
          description: "Visitor email address.",
        },
        telephone: {
          type: "string",
          description: "Visitor telephone number.",
        },
        interest: {
          type: "string",
          enum: [...interestAreas],
          description: "Primary area of interest.",
        },
        subject: {
          type: "string",
          description: "Optional short subject line.",
        },
        message: {
          type: "string",
          description:
            "Summary of the visitor's requirements in their own words.",
        },
        privacyConsent: {
          type: "boolean",
          description:
            "Must be true only after the visitor explicitly agrees to the privacy policy.",
        },
      },
      required: [
        "type",
        "fullName",
        "companyName",
        "email",
        "telephone",
        "interest",
        "message",
        "privacyConsent",
      ],
    },
  },
};
