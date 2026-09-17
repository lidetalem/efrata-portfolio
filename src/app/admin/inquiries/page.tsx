import { getInquiries } from "@/lib/queries";
import { InquiryTable } from "./inquiry-table";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  return (
    <InquiryTable
      rows={inquiries.map((i) => ({
        ...i,
        createdAt: new Date(i.createdAt).toISOString(),
      }))}
    />
  );
}
