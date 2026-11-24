import { z } from "zod";

export const interestAreas = [
  "products",
  "business-systems",
  "it-solutions",
  "consulting",
  "general",
] as const;

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  companyName: z
    .string()
    .trim()
    .min(2, "Please enter your company name.")
    .max(120, "Company name is too long."),
  email: z.string().trim().email("Please enter a valid email address."),
  telephone: z
    .string()
    .trim()
    .min(7, "Please enter a valid telephone number.")
    .max(30, "Telephone number is too long."),
  interest: z.enum(interestAreas, {
    message: "Please select an area of interest.",
  }),
  subject: z.string().trim().max(160).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please provide a short message (at least 10 characters).")
    .max(2000, "Message is too long."),
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: "You must agree to the privacy policy to continue.",
  }),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const interestLabels: Record<(typeof interestAreas)[number], string> = {
  products: "Technology Products",
  "business-systems": "Business Systems",
  "it-solutions": "IT Solutions",
  consulting: "Consulting",
  general: "General Enquiry",
};
