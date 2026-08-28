"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SettingsGeneral({ businessEmail: initEmail, whatsappNumber: initPhone, autoSend: initAuto }: { businessEmail: string; whatsappNumber: string; autoSend: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState(initEmail);
  const [phone, setPhone] = useState(initPhone);
  const [autoSend, setAutoSend] = useState(initAuto);
  const [, startTransition] = useTransition();

  const patch = (body: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3 py-2.5 px-4 rounded-[10px]" style={{ background: "color-mix(in srgb, var(--color-accent-100) 48%, transparent)", border: "1px solid var(--color-accent-300)" }}>
        <span className="w-2 h-2 rotate-45" style={{ background: "var(--color-accent)" }} />
        <span className="font-[var(--font-heading)] text-[24px]" style={{ color: "var(--brand-green)" }}>הודעות ללקוח — מייל ו־WhatsApp</span>
        <span className="flex-1" />
        <button onClick={() => { setAutoSend((v) => !v); patch({ autoSend: !autoSend }); }} className={`btn ${autoSend ? "btn-primary" : "btn-ghost"} text-[14px]`}>
          שליחה אוטומטית בשינוי סטטוס: {autoSend ? "פעיל" : "כבוי"}
        </button>
      </div>
      <p className="text-[15px] opacity-70 mb-3.5 leading-[1.6]">
        אותו נוסח משמש גם למייל וגם ל־WhatsApp. שדות מתחלפים: {"{שם}"}, {"{מספר}"}, {"{סכום}"}, {"{סטטוס}"}. ההודעות נשלחות מהמכשיר — WhatsApp נפתח באפליקציה המותקנת, והמייל נפתח בתוכנת הדואר וכל עותק נשמר בתיבה הקבועה. אין חיבור ל־API.
      </p>
      <div className="card p-4.5 gap-2 mb-3.5 max-w-[520px]">
        <label className="text-[15px]">כתובת המייל הקבועה של העסק</label>
        <input className="input text-[16px] py-2.5 px-3" dir="ltr" style={{ textAlign: "left" }} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => patch({ businessEmail: email })} />
        <span className="text-[14px] opacity-70 leading-[1.6]">כל מייל ללקוח יוצא דרך התיבה הזו ונשמר בה בעותק.</span>
      </div>
      <div className="card p-4.5 gap-2 mb-3.5 max-w-[520px]">
        <label className="text-[15px]">מספר הוואטסאפ של העסק</label>
        <input className="input text-[16px] py-2.5 px-3" dir="ltr" style={{ textAlign: "left" }} value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => patch({ whatsappNumber: phone })} />
        <span className="text-[14px] opacity-70 leading-[1.6]">המספר שאליו נפתחת שיחת וואטסאפ מכפתור הצ׳אט באתר ובאפליקציה, וממנו נשלחים עדכוני הזמנות.</span>
      </div>
    </>
  );
}
