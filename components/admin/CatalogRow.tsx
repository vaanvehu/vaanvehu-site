"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IMAGE_LIBRARY } from "@/lib/image-library";

type Model = "set" | "etrogType" | "grade" | "product" | "setUpgrade";

interface Props {
  model: Model;
  id: string;
  name: string;
  price?: number | null;
  active?: boolean | null;
  image?: string | null;
  meta?: string;
}

export default function CatalogRow({ model, id, name: initialName, price: initialPrice, active, image, meta }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const patch = (body: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch("/api/admin/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, id, patch: body }),
      });
      router.refresh();
    });
  };

  return (
    <div
      className="grid gap-2.5 items-center py-2.5 px-4.5 border-b"
      style={{ gridTemplateColumns: image !== undefined ? "60px minmax(170px,1.6fr) 100px 110px 130px 110px" : "minmax(170px,1.6fr) 100px 110px", minWidth: image !== undefined ? 780 : 400, borderColor: "var(--color-divider)" }}
    >
      {image !== undefined && (
        <div className="w-[52px] h-[52px] rounded-[8px] overflow-hidden border flex items-center justify-center" style={{ borderColor: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-100) 55%, #fff)" }}>
          {image ? <img src={`/${image}`} alt="" className="w-full h-full object-cover" /> : <span className="w-3.5 h-3.5 rotate-45 border" style={{ borderColor: "var(--color-accent)" }} />}
        </div>
      )}
      <input className="input text-[16px] py-2 px-2.5" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => patch({ nameHe: name })} />
      {initialPrice !== undefined && (
        <input
          className="input text-[16px] py-2 px-2.5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => patch({ price: Number(price) || 0 })}
        />
      )}
      {active !== undefined && active !== null && (
        <button disabled={isPending} onClick={() => patch({ active: !active })} className={`btn ${active ? "btn-primary" : "btn-ghost"} text-[14px] justify-center`}>
          {active ? "מוצג" : "מוסתר"}
        </button>
      )}
      {image !== undefined && (
        <button onClick={() => setPickerOpen(true)} className="btn btn-secondary text-[14px] justify-center">החלפת תמונה</button>
      )}
      {meta && <span className="text-[14px] opacity-60">{meta}</span>}

      {pickerOpen && (
        <div className="fixed inset-0 z-90 flex items-center justify-center p-5" style={{ background: "color-mix(in srgb, var(--color-neutral-900) 55%, transparent)" }} onClick={() => setPickerOpen(false)}>
          <div className="w-full max-w-[760px] max-h-[82vh] overflow-y-auto p-6 rounded-[16px]" style={{ background: "var(--color-surface)", border: "1px solid var(--color-accent-300)", boxShadow: "var(--shadow-lg)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-baseline gap-3 mb-4">
              <div className="font-[var(--font-heading)] text-[26px]" style={{ color: "var(--brand-green)" }}>החלפת תמונה</div>
              <div className="text-[15px] opacity-70">{name}</div>
              <span className="flex-1" />
              <button onClick={() => setPickerOpen(false)} className="btn btn-ghost text-[14px]">סגירה</button>
            </div>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))" }}>
              {IMAGE_LIBRARY.map((src) => (
                <div
                  key={src}
                  onClick={() => { patch({ image: src }); setPickerOpen(false); }}
                  className="cursor-pointer rounded-[10px] overflow-hidden bg-white border-2"
                  style={{ borderColor: image === src ? "var(--color-accent)" : "var(--color-divider)" }}
                >
                  <div className="w-full h-[96px] bg-cover bg-center" style={{ backgroundImage: `url('/${src}')` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
