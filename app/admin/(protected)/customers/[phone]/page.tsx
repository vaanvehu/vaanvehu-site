import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, LANG_LABEL, orderWaLink, orderTelLink, formatDate } from "@/lib/admin-format";

export default async function AdminCustomerPage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const decoded = decodeURIComponent(phone);
  const orders = await prisma.order.findMany({ where: { customerPhone: decoded }, orderBy: { createdAt: "desc" } });
  if (orders.length === 0) notFound();

  const first = orders[0];
  const area = first.fulfillmentType === "delivery" ? `${first.deliveryCity} · ${first.deliveryNeighborhood}` : "—";

  return (
    <>
      <Link href="/admin/customers" className="btn btn-secondary text-[19px] py-2 px-4.5 inline-flex mb-3.5 no-underline">→ כל הלקוחות</Link>
      <h3 className="text-[30px] vd:text-[38px] mb-1">{first.customerName}</h3>
      <p className="text-[17px] opacity-75 mb-5.5">{first.customerPhone} · {first.customerEmail ?? "—"} · {area}</p>
      <div className="flex gap-2.5 mb-6">
        <a href={orderWaLink(first.customerPhone, first.customerName, first.number)} className="btn btn-secondary text-[15px] no-underline">WhatsApp</a>
        <a href={orderTelLink(first.customerPhone)} className="btn btn-secondary text-[15px] no-underline">חיוג</a>
      </div>
      <h6 className="text-[22px] vd:text-[25px] mb-3">היסטוריית הזמנות</h6>
      <div className="card p-0 overflow-x-auto">
        {orders.map((o) => (
          <Link key={o.id} href={`/admin/orders/${o.id}`} className="adm-row grid gap-3 items-center py-3.5 px-4.5 border-b text-[15px] no-underline" style={{ gridTemplateColumns: "110px 1fr 110px 130px 100px", minWidth: 700, borderColor: "var(--color-divider)", color: "var(--color-text)" }}>
            <span className="font-[var(--font-heading)] text-[18px]">#{o.number}</span>
            <span className="opacity-75">{formatDate(o.createdAt)}</span>
            <span className="font-[var(--font-heading)] text-[18px]" style={{ color: "var(--color-accent-700)" }}>₪{o.total}</span>
            <span>{STATUS_LABEL[o.status]}</span>
            <span className="text-[14px] opacity-70">{LANG_LABEL[o.lang]}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
