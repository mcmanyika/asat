import { redirect } from "next/navigation";

export default async function AdminFeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/feedback?open=${encodeURIComponent(id)}`);
}
