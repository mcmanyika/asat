import { z } from "zod";
import type { OpenAI } from "openai";

export const feedbackCategories = [
  "website",
  "product",
  "service",
  "chat",
  "general",
] as const;

export const chatFeedbackToolSchema = z.object({
  category: z.enum(feedbackCategories).default("general"),
  rating: z.number().int().min(1).max(5).optional(),
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().optional(),
  message: z.string().trim().min(10).max(2000),
  privacyConsent: z.literal(true),
});

export type ChatFeedbackToolInput = z.infer<typeof chatFeedbackToolSchema>;

export const saveFeedbackTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "save_feedback",
    description:
      "Save visitor feedback about ASAT Technologies, the website, products, services or this chat after collecting their comments and explicit privacy consent. Contact details are optional.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: {
          type: "string",
          enum: [...feedbackCategories],
          description: "What the feedback is about.",
        },
        rating: {
          type: "integer",
          minimum: 1,
          maximum: 5,
          description: "Optional 1–5 satisfaction rating if the visitor shared one.",
        },
        fullName: {
          type: "string",
          description: "Optional visitor name if they want to be contacted.",
        },
        email: {
          type: "string",
          description: "Optional visitor email if they want a reply.",
        },
        message: {
          type: "string",
          description: "The visitor's feedback in their own words.",
        },
        privacyConsent: {
          type: "boolean",
          description:
            "Must be true only after the visitor explicitly agrees to the privacy policy.",
        },
      },
      required: ["message", "privacyConsent"],
    },
  },
};
