"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Template { id: string; title: string; subject: string; body: string }

export default function TemplateEditor({ template }: { template: Template }) {
  const router = useRouter();
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [, startTransition] = useTransition();

  const patch = (patchBody: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch(`/api/admin/templates/${template.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patchBody) });
      router.refresh();
    });
  };

  return (
    <div className="card p-4.5 gap-2.5">
      <div className="font-[var(--font-heading)] text-[22px]" style={{ color: "var(--brand-green)" }}>{template.title}</div>
      <div className="field">
        <label className="text-[14px]">נושא המייל</label>
        <input className="input text-[15px] py-2.5 px-3" value={subject} onChange={(e) => setSubject(e.target.value)} onBlur={() => patch({ subject })} />
      </div>
      <div className="field">
        <label className="text-[14px]">נוסח ההודעה</label>
        <textarea className="input text-[15px] min-h-[110px]" value={body} onChange={(e) => setBody(e.target.value)} onBlur={() => patch({ body })} />
      </div>
    </div>
  );
}
