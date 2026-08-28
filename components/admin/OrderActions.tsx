"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { STATUS_ORDER, STATUS_LABEL, fillTemplate } from "@/lib/admin-format";
import { mailtoHref, waHref } from "@/lib/whatsapp";
import MessageActionLink from "./MessageActionLink";

interface Template { id: string; title: string; subject: string; body: string }
interface OrderLite {
  id: string; number: string; status: OrderStatus; paymentStatus: PaymentStatus; note: string;
  customerName: string; customerPhone: string; customerEmail: string | null;
  fulfillmentType: "pickup" | "delivery"; total: number;
}

export default function OrderActions({ order, templates, businessEmail }: { order: OrderLite; templates: Template[]; businessEmail: string }) {
  const router = useRouter();
  const [note, setNote] = useState(order.note);
  const [isPending, startTransition] = useTransition();

  const patch = (body: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    });
  };

  const tpl = (id: string) => templates.find((t) => t.id === id) ?? templates[0];
  const templateForStatus =
    order.status === "out_for_delivery" ? tpl("m3") :
    order.status === "ready" && order.fulfillmentType === "pickup" ? tpl("m2") :
    tpl("m4");
  const confirmTemplate = tpl("m1");

  const vars = { name: order.customerName, number: order.number, total: order.total, status: STATUS_LABEL[order.status] };
  const waStatusHref = templateForStatus ? waHref(order.customerPhone, fillTemplate(templateForStatus.body, vars)) : "#";
  const waConfirmHref = confirmTemplate ? waHref(order.customerPhone, fillTemplate(confirmTemplate.body, vars)) : "#";
  const mailStatusHref = order.customerEmail && templateForStatus
    ? mailtoHref(order.customerEmail, { bcc: businessEmail, subject: fillTemplate(templateForStatus.subject, vars), body: fillTemplate(templateForStatus.body, vars) })
    : undefined;
  const mailConfirmHref = order.customerEmail && confirmTemplate
    ? mailtoHref(order.customerEmail, { bcc: businessEmail, subject: fillTemplate(confirmTemplate.subject, vars), body: fillTemplate(confirmTemplate.body, vars) })
    : undefined;

  return (
    <div className="card p-4.5 gap-3.5 mb-4">
      <div className="card-kicker">פעולות</div>
      <div className="flex flex-wrap gap-2">
        {STATUS_ORDER.map((st) => (
          <button
            key={st}
            disabled={isPending}
            onClick={() => patch({ status: st })}
            className={`btn ${order.status === st ? "btn-primary" : "btn-secondary"} text-[15px] py-2.5 px-4`}
          >
            {STATUS_LABEL[st]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button disabled={isPending} onClick={() => patch({ paymentStatus: order.paymentStatus === "paid" ? "unpaid" : "paid" })} className="btn btn-secondary text-[15px]">
          סימון תשלום: {order.paymentStatus === "paid" ? "שולם" : "ממתין"}
        </button>
        <MessageActionLink orderId={order.id} href={waStatusHref} channel="whatsapp" templateId={templateForStatus?.id} className="btn btn-primary text-[15px] no-underline">
          שלח עדכון סטטוס ב־WhatsApp
        </MessageActionLink>
        <MessageActionLink orderId={order.id} href={waConfirmHref} channel="whatsapp" templateId={confirmTemplate?.id} className="btn btn-secondary text-[15px] no-underline">
          שלח אישור ב־WhatsApp
        </MessageActionLink>
        {mailConfirmHref && (
          <MessageActionLink orderId={order.id} href={mailConfirmHref} channel="email" templateId={confirmTemplate?.id} className="btn btn-secondary text-[15px] no-underline">
            אישור במייל
          </MessageActionLink>
        )}
        {mailStatusHref && (
          <MessageActionLink orderId={order.id} href={mailStatusHref} channel="email" templateId={templateForStatus?.id} className="btn btn-secondary text-[15px] no-underline">
            עדכון סטטוס במייל
          </MessageActionLink>
        )}
      </div>
      <div className="text-[14px] opacity-70 leading-[1.6]">
        WhatsApp נפתח באפליקציית WhatsApp המותקנת במחשב או בטלפון, עם הודעה מוכנה — בלי API. המייל נפתח בתוכנת הדואר עם נושא וגוף מוכנים.
      </div>
      <div className="field">
        <label className="text-[15px]">הערה פנימית</label>
        <textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => patch({ note })} />
      </div>
    </div>
  );
}
