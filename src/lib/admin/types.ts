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

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  status: StaffStatus;
};

export type StaffProfileRow = {
  user_id: string;
  email: string;
  full_name: string | null;
  status: StaffStatus;
  notify_on_enquiry: boolean;
  created_at: string;
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
