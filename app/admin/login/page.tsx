"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const unlock = async () => {
    setSubmitting(true);
    setError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: "var(--color-bg)" }}>
      <div className="card elev-sm w-full max-w-[420px] py-9 px-7.5 text-center gap-4.5">
        <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-14 w-auto mx-auto mb-1.5" />
        <div className="font-[var(--font-heading)] text-[34px] font-semibold leading-[1.1]" style={{ color: "var(--brand-green)" }}>בקרה ושליטה</div>
        <p className="text-[16px] opacity-75">כניסת מנהל בלבד</p>
        <div className="field text-right">
          <label className="text-[16px]">סיסמה</label>
          <input
            className="input text-[18px] p-3.5"
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
          />
        </div>
        {error && <p className="text-[15px]" style={{ color: "#8f2b2b" }}>סיסמה שגויה</p>}
        <button onClick={unlock} disabled={submitting} className="btn btn-primary btn-block justify-center text-[19px] py-3.5">כניסה</button>
        <p className="text-[14px] opacity-55">הסיסמה מוגדרת במשתנה הסביבה ADMIN_PASSWORD</p>
      </div>
    </div>
  );
}
