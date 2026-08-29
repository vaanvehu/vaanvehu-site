"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step =
  | { kind: "password" }
  | { kind: "setup_totp"; pendingToken: string; secret: string; otpauthUrl: string }
  | { kind: "verify_totp"; pendingToken: string };

export default function AdminLoginPage() {
  const [step, setStep] = useState<Step>({ kind: "password" });
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submitPassword = async () => {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.message || (res.status === 429 ? "יותר מדי ניסיונות כניסה. נסה שוב בעוד כמה דקות." : "סיסמה שגויה"));
      return;
    }
    if (data.step === "setup_totp") {
      setStep({ kind: "setup_totp", pendingToken: data.pendingToken, secret: data.secret, otpauthUrl: data.otpauthUrl });
    } else {
      setStep({ kind: "verify_totp", pendingToken: data.pendingToken });
    }
  };

  const submitCode = async (pendingToken: string) => {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login/totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pendingToken, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    setSubmitting(false);
    if (data.error === "expired") {
      setError("הזמן להזנת הקוד פג. יש להתחיל מחדש.");
      setStep({ kind: "password" });
      setPw("");
    } else {
      setError(data.message || "קוד שגוי");
    }
    setCode("");
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: "var(--color-bg)" }}>
      <div className="card elev-sm w-full max-w-[440px] py-9 px-7.5 text-center gap-4.5">
        <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-14 w-auto mx-auto mb-1.5" />
        <div className="font-[var(--font-heading)] text-[34px] font-semibold leading-[1.1]" style={{ color: "var(--brand-green)" }}>בקרה ושליטה</div>

        {step.kind === "password" && (
          <>
            <p className="text-[16px] opacity-75">כניסת מנהל בלבד</p>
            <div className="field text-right">
              <label className="text-[16px]">סיסמה</label>
              <input
                className="input text-[18px] p-3.5"
                type="password"
                autoFocus
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") submitPassword(); }}
              />
            </div>
            {error && <p className="text-[15px]" style={{ color: "#8f2b2b" }}>{error}</p>}
            <button onClick={submitPassword} disabled={submitting || !pw} className="btn btn-primary btn-block justify-center text-[19px] py-3.5">כניסה</button>
            <p className="text-[14px] opacity-55">הסיסמה מוגדרת במשתנה הסביבה ADMIN_PASSWORD. שלב נוסף של קוד אימות יופיע אחרי הסיסמה.</p>
          </>
        )}

        {step.kind === "setup_totp" && (
          <>
            <p className="text-[16px] opacity-85 leading-[1.6]">
              זו הכניסה הראשונה — יש להגדיר אימות דו-שלבי. פתחו אפליקציית Authenticator (Google Authenticator, Authy וכו׳),
              הוסיפו חשבון חדש והזינו את הקוד הבא ידנית (אין סורק QR כאן):
            </p>
            <div className="card p-3.5" style={{ background: "var(--color-surface)" }}>
              <div className="font-mono text-[18px] tracking-[0.08em] break-all select-all" dir="ltr">{step.secret}</div>
            </div>
            <div className="field text-right">
              <label className="text-[16px]">קוד בן 6 ספרות מהאפליקציה</label>
              <input
                className="input text-[22px] p-3.5 text-center tracking-[0.3em]"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter" && code.length === 6) submitCode(step.pendingToken); }}
              />
            </div>
            {error && <p className="text-[15px]" style={{ color: "#8f2b2b" }}>{error}</p>}
            <button onClick={() => submitCode(step.pendingToken)} disabled={submitting || code.length !== 6} className="btn btn-primary btn-block justify-center text-[19px] py-3.5">
              אישור והפעלת אימות דו-שלבי
            </button>
            <p className="text-[14px] opacity-55">שמרו את הקוד הזה במקום בטוח — הוא נדרש כדי לשחזר גישה אם תחליפו מכשיר.</p>
          </>
        )}

        {step.kind === "verify_totp" && (
          <>
            <p className="text-[16px] opacity-75">הזינו את הקוד בן 6 הספרות מאפליקציית האימות</p>
            <div className="field text-right">
              <label className="text-[16px]">קוד אימות</label>
              <input
                className="input text-[22px] p-3.5 text-center tracking-[0.3em]"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter" && code.length === 6) submitCode(step.pendingToken); }}
              />
            </div>
            {error && <p className="text-[15px]" style={{ color: "#8f2b2b" }}>{error}</p>}
            <button onClick={() => submitCode(step.pendingToken)} disabled={submitting || code.length !== 6} className="btn btn-primary btn-block justify-center text-[19px] py-3.5">כניסה</button>
          </>
        )}
      </div>
    </div>
  );
}
