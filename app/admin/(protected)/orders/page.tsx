import Link from "next/link";
import { Suspense } from "react";
import type { Order } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, LANG_LABEL, PAYMENT_LABEL, STATUS_TINT, STATUS_EDGE, orderAddress, orderWaLink, formatDate } from "@/lib/admin-format";
import OrderSearchBox from "@/components/admin/OrderSearchBox";

const FILTERS: { id: string; label: string; test: (o: Order) => boolean }[] = [
  { id: "all", label: "הכול", test: () => true },
  { id: "new", label: "חדשות", test: (o) => o.status === "new" },
  { id: "prep", label: "בהכנה", test: (o) => o.status === "in_process" },
  { id: "ready", label: "מוכנות", test: (o) => o.status === "ready" },
  { id: "delivery", label: "משלוחים", test: (o) => o.fulfillmentType === "delivery" },
  { id: "pickup", label: "איסוף עצמי", test: (o) => o.fulfillmentType === "pickup" },
  { id: "unpaid", label: "ממתין לתשלום", test: (o) => o.paymentStatus === "unpaid" },
  { id: "done", label: "הושלמו", test: (o) => o.status === "delivered" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = "all", q = "" } = await searchParams;
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { pickupPoint: true } });

  const filter = FILTERS.find((x) => x.id === f) ?? FILTERS[0];
  const query = q.trim().toLowerCase();
  const rows = orders
    .filter(filter.test)
    .filter((o) => {
      if (!query) return true;
      const addr = orderAddress(o, o.pickupPoint?.nameHe);
      return [o.number, o.customerName, o.customerPhone, addr].join(" ").toLowerCase().includes(query);
    });

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">הזמנות</h3>
      <p className="text-[16px] opacity-70 mb-4.5">מרכז העבודה · {rows.length} הזמנות בתצוגה</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {FILTERS.map((flt) => (
          <Link
            key={flt.id}
            href={`/admin/orders?f=${flt.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`btn ${flt.id === f ? "btn-primary" : "btn-secondary"} text-[15px] py-2.5 px-4 no-underline`}
          >
            {flt.label}
          </Link>
        ))}
      </div>

      <Suspense>
        <OrderSearchBox />
      </Suspense>

      <div className="card p-0 overflow-x-auto">
        <div
          className="grid gap-2.5 py-3.5 px-4.5 border-b font-[var(--font-heading)] text-[16px]"
          style={{ gridTemplateColumns: "96px minmax(140px,1.3fr) minmax(130px,1.1fr) minmax(125px,1fr) 100px 100px minmax(150px,1.2fr) 110px 100px 90px", minWidth: 1300, borderColor: "var(--color-divider)", background: "color-mix(in srgb, var(--color-accent-100) 35%, transparent)" }}
        >
          <span>הזמנה</span><span>לקוח</span><span>טלפון</span><span>תאריך</span><span>סכום</span><span>קבלה</span><span>עיר / שכונה</span><span>סטטוס</span><span>תשלום</span><span>שפה</span>
        </div>
        {rows.map((o) => (
          <div
            key={o.id}
            className="grid gap-2.5 items-center py-3.5 px-4.5 border-b text-[15px]"
            style={{ gridTemplateColumns: "96px minmax(140px,1.3fr) minmax(130px,1.1fr) minmax(125px,1fr) 100px 100px minmax(150px,1.2fr) 110px 100px 90px", minWidth: 1300, borderColor: "var(--color-divider)" }}
          >
            <Link href={`/admin/orders/${o.id}`} className="font-[var(--font-heading)] text-[18px] no-underline">#{o.number}</Link>
            <span>{o.customerName}</span>
            <a href={orderWaLink(o.customerPhone, o.customerName, o.number)} className="text-[14px] no-underline">{o.customerPhone}</a>
            <span className="opacity-75 text-[14px]">{formatDate(o.createdAt)}</span>
            <span className="font-[var(--font-heading)] text-[18px]" style={{ color: "var(--color-accent-700)" }}>₪{o.total}</span>
            <span className="text-[14px]">{o.fulfillmentType === "delivery" ? "משלוח" : "איסוף עצמי"}</span>
            <span className="text-[14px]">{o.fulfillmentType === "delivery" ? `${o.deliveryCity} · ${o.deliveryNeighborhood}` : "—"}</span>
            <span className="text-[14px] text-center py-1 px-2 rounded-[20px]" style={{ background: STATUS_TINT[o.status], border: `1px solid ${STATUS_EDGE[o.status]}` }}>
              {STATUS_LABEL[o.status]}
            </span>
            <span className="text-[14px]" style={{ color: o.paymentStatus === "paid" ? "var(--brand-green)" : "#8f2b2b" }}>{PAYMENT_LABEL[o.paymentStatus]}</span>
            <span className="text-[14px] opacity-70">{LANG_LABEL[o.lang]}</span>
          </div>
        ))}
      </div>
    </>
  );
}
