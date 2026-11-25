export type EnquiryRow = {
  id: string;
  created_at: string;
  type: "contact" | "quote" | "demo" | "consultation";
  full_name: string;
  company_name: string;
  email: string;
  telephone: string;
  interest: string;
  subject: string | null;
  message: string;
  privacy_consent: boolean;
  status: "new" | "in_progress" | "closed";
  source: string;
};

export type FeedbackRow = {
  id: string;
  created_at: string;
  category: "website" | "product" | "service" | "chat" | "general";
  rating: number | null;
  full_name: string | null;
  email: string | null;
  message: string;
  privacy_consent: boolean;
  status: "new" | "reviewed" | "closed";
  source: string;
};

export type StaffStatus = "pending" | "approved" | "rejected";

export type StaffRole = "staff" | "superuser";

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  status: StaffStatus;
  role: StaffRole;
};

export type StaffProfileRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  status: StaffStatus;
  role: StaffRole;
  notify_on_enquiry: boolean;
  created_at: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "void";

export type InvoiceItemRow = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
};

export type InvoiceRow = {
  id: string;
  number: string;
  status: InvoiceStatus;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  issue_date: string;
  due_date: string | null;
  currency: string;
  tax_rate: number;
  notes: string | null;
  enquiry_id: string | null;
  subtotal: number;
  tax_amount: number;
  total: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type InvoiceWithItems = InvoiceRow & {
  items: InvoiceItemRow[];
};

export type InvoiceItemInput = {
  description: string;
  quantity: number;
  unit_price: number;
};

export type DashboardStats = {
  enquiriesTotal: number;
  enquiriesNew: number;
  enquiriesInProgress: number;
  enquiriesClosed: number;
  feedbackTotal: number;
  feedbackNew: number;
  feedbackAvgRating: number | null;
  enquiriesByType: { label: string; count: number }[];
  enquiriesBySource: { label: string; count: number }[];
  enquiriesByInterest: { label: string; count: number }[];
  recentEnquiries: EnquiryRow[];
  recentFeedback: FeedbackRow[];
};
