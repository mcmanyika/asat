import { redirect } from "next/navigation";

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/enquiries?open=${encodeURIComponent(id)}`);
}
