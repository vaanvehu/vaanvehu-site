"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Neighborhood { id: string; nameHe: string }
interface City { id: string; nameHe: string; active: boolean; price: number; minimum: number; freeOver: number; neighborhoods: Neighborhood[] }

export default function CityEditor({ city }: { city: City }) {
  const router = useRouter();
  const [name, setName] = useState(city.nameHe);
  const [price, setPrice] = useState(String(city.price));
  const [min, setMin] = useState(String(city.minimum));
  const [freeOver, setFreeOver] = useState(String(city.freeOver));
  const [, startTransition] = useTransition();

  const patch = (body: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch("/api/admin/cities", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: city.id, patch: body }) });
      router.refresh();
    });
  };

  const addNeighborhood = () => {
    startTransition(async () => {
      await fetch(`/api/admin/cities/${city.id}/neighborhoods`, { method: "POST" });
      router.refresh();
    });
  };

  return (
    <div className="border-b py-3.5 px-4.5" style={{ borderColor: "var(--color-divider)" }}>
      <div className="grid gap-3 items-center" style={{ gridTemplateColumns: "minmax(160px,1.2fr) 110px 120px 120px 140px", minWidth: 720 }}>
        <input className="input text-[16px] py-2.5 px-3" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => patch({ nameHe: name })} />
        <button onClick={() => patch({ active: !city.active })} className={`btn ${city.active ? "btn-primary" : "btn-ghost"} text-[14px]`}>{city.active ? "פעיל" : "לא פעיל"}</button>
        <input className="input text-[16px] py-2.5 px-3" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => patch({ price: Number(price) || 0 })} />
        <input className="input text-[16px] py-2.5 px-3" value={min} onChange={(e) => setMin(e.target.value)} onBlur={() => patch({ minimum: Number(min) || 0 })} />
        <input className="input text-[16px] py-2.5 px-3" value={freeOver} onChange={(e) => setFreeOver(e.target.value)} onBlur={() => patch({ freeOver: Number(freeOver) || 0 })} />
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-2.5">
        <span className="text-[14px] opacity-65">שכונות:</span>
        {city.neighborhoods.map((n) => <span key={n.id} className="tag tag-outline text-[14px]">{n.nameHe}</span>)}
        <button onClick={addNeighborhood} className="btn btn-ghost text-[14px] py-1.5 px-3">+ שכונה</button>
      </div>
    </div>
  );
}
