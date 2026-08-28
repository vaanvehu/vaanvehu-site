import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/admin-format";

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  const byPhone = new Map<string, { name: string; phone: string; email: string | null; area: string; count: number; sum: number; last: Date }>();
  for (const o of orders) {
    const area = o.fulfillmentType === "delivery" ? `${o.deliveryCity} · ${o.deliveryNeighborhood}` : "—";
    const existing = byPhone.get(o.customerPhone);
    if (existing) {
      existing.count += 1;
      existing.sum += o.total;
      if (o.createdAt > existing.last) existing.last = o.createdAt;
    } else {
      byPhone.set(o.customerPhone, { name: o.customerName, phone: o.customerPhone, email: o.customerEmail, area, count: 1, sum: o.total, last: o.createdAt });
    }
  }
  const customers = Array.from(byPhone.values());

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">לקוחות</h3>
      <p className="text-[16px] opacity-70 mb-5">{customers.length} לקוחות · נוצר מתוך ההזמנות</p>
      <div className="card p-0 overflow-x-auto">
        <div className="grid gap-2.5 py-3.5 px-4.5 border-b font-[var(--font-heading)] text-[16px]" style={{ gridTemplateColumns: "1.3fr 1fr 1.3fr 1.2fr 90px 110px 130px", minWidth: 900, borderColor: "var(--color-divider)", background: "color-mix(in srgb, var(--color-accent-100) 35%, transparent)" }}>
          <span>שם</span><span>טלפון</span><span>אימייל</span><span>עיר / שכונה</span><span>הזמנות</span><span>מצטבר</span><span>הזמנה אחרונה</span>
        </div>
        {customers.map((c) => (
          <Link key={c.phone} href={`/admin/customers/${encodeURIComponent(c.phone)}`} className="adm-row grid gap-2.5 items-center py-3.5 px-4.5 border-b text-[15px] no-underline" style={{ gridTemplateColumns: "1.3fr 1fr 1.3fr 1.2fr 90px 110px 130px", minWidth: 900, borderColor: "var(--color-divider)", color: "var(--color-text)" }}>
            <span className="font-[var(--font-heading)] text-[18px]">{c.name}</span>
            <span className="text-[14px]">{c.phone}</span>
            <span className="text-[14px] opacity-80">{c.email ?? "—"}</span>
            <span className="text-[14px]">{c.area}</span>
            <span>{c.count}</span>
            <span className="font-[var(--font-heading)] text-[18px]" style={{ color: "var(--color-accent-700)" }}>₪{c.sum}</span>
            <span className="text-[14px] opacity-75">{formatDate(c.last)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
