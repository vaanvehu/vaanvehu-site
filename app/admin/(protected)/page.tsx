import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, LANG_LABEL, formatDate } from "@/lib/admin-format";

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = (fn: (o: (typeof orders)[number]) => boolean) => orders.filter(fn).length;

  const stats = [
    { label: "הזמנות חדשות", value: count((o) => o.status === "new"), href: "/admin/orders?f=new" },
    { label: "הזמנות היום", value: count((o) => o.createdAt >= today), href: "/admin/orders" },
    { label: "בהכנה", value: count((o) => o.status === "in_process"), href: "/admin/orders?f=prep" },
    { label: "מוכנות", value: count((o) => o.status === "ready"), href: "/admin/orders?f=ready" },
    { label: "צריך לשלוח", value: count((o) => o.fulfillmentType === "delivery" && o.status !== "delivered" && o.status !== "cancelled"), href: "/admin/deliveries" },
    { label: "הושלמו", value: count((o) => o.status === "delivered"), href: "/admin/orders?f=done" },
    { label: "ממתינות לתשלום", value: count((o) => o.paymentStatus === "unpaid"), href: "/admin/orders?f=unpaid" },
    { label: "סך הזמנות", value: orders.length, href: "/admin/orders" },
    { label: "סך מכירות", value: `₪${orders.reduce((a, o) => a + o.total, 0)}`, href: "/admin/orders" },
  ];

  const recent = orders.slice(0, 5);

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">דשבורד</h3>
      <p className="text-[16px] opacity-70 mb-6">תמונת מצב · {formatDate(new Date())}</p>
      <div className="grid grid-cols-2 vm:grid-cols-3 vd:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3.5 mb-7.5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4.5 gap-1.5 no-underline" style={{ color: "var(--color-text)", borderTop: "3px solid var(--color-accent)" }}>
            <div className="text-[15px] vd:text-[16px] opacity-75">{s.label}</div>
            <div className="font-[var(--font-heading)] text-[28px] vd:text-[34px] font-semibold" style={{ color: "var(--brand-green)" }}>{s.value}</div>
          </Link>
        ))}
      </div>
      <h6 className="text-[22px] vd:text-[25px] mb-3">הזמנות אחרונות</h6>
      <div className="card p-0 overflow-x-auto">
        {recent.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className="adm-row grid gap-3 items-center py-3.5 px-4.5 border-b text-[16px] no-underline"
            style={{ gridTemplateColumns: "110px 1.4fr 1fr 130px 120px 120px", minWidth: 820, borderColor: "var(--color-divider)", color: "var(--color-text)" }}
          >
            <span className="font-[var(--font-heading)] text-[19px]">#{o.number}</span>
            <span>{o.customerName}</span>
            <span className="opacity-75">{formatDate(o.createdAt)}</span>
            <span className="font-[var(--font-heading)] text-[19px]" style={{ color: "var(--color-accent-700)" }}>₪{o.total}</span>
            <span className="text-[15px]">{STATUS_LABEL[o.status]}</span>
            <span className="text-[15px] opacity-70">{LANG_LABEL[o.lang]}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
