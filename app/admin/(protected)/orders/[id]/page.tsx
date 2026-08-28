import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, LANG_LABEL, orderAddress, orderWaLink, orderTelLink, formatDate } from "@/lib/admin-format";
import { pickField } from "@/lib/i18n";
import OrderActions from "@/components/admin/OrderActions";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { lines: true, pickupPoint: true } });
  if (!order) notFound();

  const [templates, settings] = await Promise.all([
    prisma.messageTemplate.findMany({ orderBy: { sort: "asc" } }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const fulfillLabel = order.fulfillmentType === "delivery" ? "משלוח" : "איסוף עצמי";
  const fulfillDetail = order.fulfillmentType === "delivery"
    ? orderAddress(order)
    : (order.pickupPoint ? pickField(order.pickupPoint, "name", "he") : "");

  return (
    <>
      <Link href="/admin/orders" className="btn btn-secondary text-[19px] py-2 px-4.5 inline-flex mb-3.5 no-underline">→ כל ההזמנות</Link>
      <div className="flex items-baseline gap-4 flex-wrap mb-1.5">
        <h3 className="text-[30px] vd:text-[38px]">הזמנה #{order.number}</h3>
        <span className="text-[16px] opacity-70">{formatDate(order.createdAt)}</span>
        <span className="tag tag-outline text-[14px]">{LANG_LABEL[order.lang]}</span>
      </div>
      <p className="text-[16px] opacity-70 mb-5.5">{STATUS_LABEL[order.status]} · {order.paymentStatus === "paid" ? "שולם" : "ממתין"}</p>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div className="card p-4.5 gap-2">
          <div className="card-kicker">פרטי הלקוח</div>
          <div className="font-[var(--font-heading)] text-[22px]">{order.customerName}</div>
          <div className="text-[16px]">{order.customerPhone} · {order.customerEmail ?? "—"}</div>
          <div className="flex gap-2.5 flex-wrap mt-2">
            <a href={orderWaLink(order.customerPhone, order.customerName, order.number)} className="btn btn-secondary text-[15px] no-underline">WhatsApp</a>
            <a href={orderTelLink(order.customerPhone)} className="btn btn-secondary text-[15px] no-underline">חיוג</a>
            <Link href={`/admin/customers/${encodeURIComponent(order.customerPhone)}`} className="btn btn-ghost text-[15px] no-underline">כרטיס לקוח</Link>
          </div>
        </div>
        <div className="card p-4.5 gap-2">
          <div className="card-kicker">קבלת ההזמנה</div>
          <div className="font-[var(--font-heading)] text-[22px]">{fulfillLabel}</div>
          <div className="text-[16px] leading-[1.7]">{fulfillDetail}</div>
          {order.addressNote && <div className="text-[15px] opacity-80">הערה לשליח: {order.addressNote}</div>}
        </div>
      </div>

      <div className="card p-0 mb-4 overflow-hidden">
        <div className="py-3.5 px-4.5 border-b font-[var(--font-heading)] text-[19px]" style={{ borderColor: "var(--color-divider)", background: "color-mix(in srgb, var(--color-accent-100) 35%, transparent)" }}>
          פרטי ההזמנה
        </div>
        {order.lines.map((it) => (
          <div key={it.id} className="grid gap-2.5 items-center py-3.5 px-4.5 border-b text-[16px]" style={{ gridTemplateColumns: "minmax(220px,2.2fr) 70px 110px", borderColor: "var(--color-divider)" }}>
            <span>{it.name}{it.extrasText && <span className="opacity-70 text-[14px]"> · {it.extrasText}</span>}</span>
            <span>× {it.qty}</span>
            <span className="font-[var(--font-heading)] text-[18px]" style={{ color: "var(--color-accent-700)" }}>₪{it.qty * it.unitPrice}</span>
          </div>
        ))}
        <div className="flex justify-between py-4 px-4.5 font-[var(--font-heading)] text-[21px]">
          <span>סה״כ</span><span style={{ color: "var(--color-accent-700)" }}>₪{order.total}</span>
        </div>
      </div>

      <OrderActions
        order={{
          id: order.id, number: order.number, status: order.status, paymentStatus: order.paymentStatus,
          note: order.note ?? "", customerName: order.customerName, customerPhone: order.customerPhone,
          customerEmail: order.customerEmail, fulfillmentType: order.fulfillmentType, total: order.total,
        }}
        templates={templates}
        businessEmail={settings?.businessEmail ?? ""}
      />
    </>
  );
}
