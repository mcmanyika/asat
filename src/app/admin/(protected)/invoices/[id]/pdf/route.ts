import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/admin/auth";
import { getInvoiceById } from "@/lib/admin/invoices";
import { buildInvoicePdf } from "@/lib/invoices/pdf";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const staff = await getStaffUser();
  if (!staff) {
    return NextResponse.redirect(new URL("/admin/login", _request.url));
  }

  const { id } = await context.params;
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const pdf = await buildInvoicePdf(invoice);

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
