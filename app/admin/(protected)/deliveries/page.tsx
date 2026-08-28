import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, STATUS_EDGE, LANG_LABEL, nextStatus, orderWaLink, orderTelLink } from "@/lib/admin-format";
import AdvanceStatusButton from "@/components/admin/AdvanceStatusButton";

export default async function AdminDeliveriesPage() {
  const orders = await prisma.order.findMany({
    where: { fulfillmentType: "delivery", status: { notIn: ["delivered", "cancelled"] } },
    orderBy: { createdAt: "asc" },
  });

  const cityNames: string[] = [];
  orders.forEach((o) => { if (o.deliveryCity && !cityNames.includes(o.deliveryCity)) cityNames.push(o.deliveryCity); });

  return (
    <>
      <h3 className="text-[30px] vd:text-[38px] mb-1">משלוחים</h3>
      <p className="text-[16px] opacity-70 mb-5">לביצוע · מסודר לפי עיר ושכונה · {orders.length} משלוחים</p>

      {cityNames.map((city) => {
        const inCity = orders.filter((o) => o.deliveryCity === city);
        const nbNames: string[] = [];
        inCity.forEach((o) => { if (o.deliveryNeighborhood && !nbNames.includes(o.deliveryNeighborhood)) nbNames.push(o.deliveryNeighborhood); });

        return (
          <div key={city} className="mb-6.5">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-[var(--font-heading)] text-[26px]" style={{ color: "var(--brand-green)" }}>{city}</span>
              <span className="text-[15px] opacity-70">{inCity.length} משלוחים</span>
              <span className="flex-1 h-px" style={{ background: "var(--color-divider)" }} />
            </div>
            {nbNames.map((nb) => (
              <div key={nb} className="mb-3.5">
                <div className="font-[var(--font-heading)] text-[20px] mb-2 opacity-90">{nb}</div>
                <div className="flex flex-col gap-2.5">
                  {inCity.filter((o) => o.deliveryNeighborhood === nb).map((o) => (
                    <div key={o.id} className="card py-3.5 px-4 gap-2" style={{ borderInlineEnd: `4px solid ${STATUS_EDGE[o.status]}` }}>
                      <div className="flex justify-between items-baseline gap-3 flex-wrap">
                        <Link href={`/admin/orders/${o.id}`} className="font-[var(--font-heading)] text-[19px] no-underline">#{o.number} · {o.customerName}</Link>
                        <span className="text-[15px]">{STATUS_LABEL[o.status]} · {o.paymentStatus === "paid" ? "שולם" : "ממתין"}</span>
                      </div>
                      <div className="text-[16px]">{o.street} {o.house}{o.apt ? `, דירה ${o.apt}` : ""}</div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <a href={orderWaLink(o.customerPhone, o.customerName, o.number)} className="btn btn-secondary text-[14px] no-underline">WhatsApp</a>
                        <a href={orderTelLink(o.customerPhone)} className="btn btn-secondary text-[14px] no-underline">{o.customerPhone}</a>
                        <a
                          href={`https://waze.com/ul?q=${encodeURIComponent(`${o.street} ${o.house}, ${o.deliveryNeighborhood}, ${o.deliveryCity}`)}`}
                          target="_blank" rel="noreferrer" className="btn btn-ghost text-[14px] no-underline"
                        >
                          ניווט
                        </a>
                        <AdvanceStatusButton orderId={o.id} next={nextStatus(o.status)} label={`→ ${STATUS_LABEL[nextStatus(o.status)]}`} />
                        <span className="text-[14px] opacity-65">{LANG_LABEL[o.lang]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
