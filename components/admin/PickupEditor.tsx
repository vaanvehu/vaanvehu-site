"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Pickup { id: string; nameHe: string; addressHe: string; hoursHe: string; phone: string | null; note: string | null; active: boolean }

export default function PickupEditor({ pickup }: { pickup: Pickup }) {
  const router = useRouter();
  const [name, setName] = useState(pickup.nameHe);
  const [address, setAddress] = useState(pickup.addressHe);
  const [hours, setHours] = useState(pickup.hoursHe);
  const [phone, setPhone] = useState(pickup.phone ?? "");
  const [note, setNote] = useState(pickup.note ?? "");
  const [, startTransition] = useTransition();

  const patch = (body: Record<string, unknown>) => {
    startTransition(async () => {
      await fetch("/api/admin/pickups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: pickup.id, patch: body }) });
      router.refresh();
    });
  };

  return (
    <div className="card p-4.5 gap-2.5">
      <input className="input text-[18px] py-2.5 px-3 font-[var(--font-heading)]" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => patch({ nameHe: name })} />
      <input className="input text-[15px] py-2.5 px-3" value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => patch({ addressHe: address })} placeholder="כתובת" />
      <input className="input text-[15px] py-2.5 px-3" value={hours} onChange={(e) => setHours(e.target.value)} onBlur={() => patch({ hoursHe: hours })} placeholder="שעות פעילות" />
      <input className="input text-[15px] py-2.5 px-3" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => patch({ phone })} placeholder="טלפון" />
      <textarea className="input text-[15px]" value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => patch({ note })} placeholder="הערה" />
      <button onClick={() => patch({ active: !pickup.active })} className={`btn ${pickup.active ? "btn-primary" : "btn-ghost"} justify-center text-[14px]`}>
        {pickup.active ? "פעיל" : "לא פעיל"}
      </button>
    </div>
  );
}
