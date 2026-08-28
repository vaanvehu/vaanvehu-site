"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function AddCityButton() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(async () => { await fetch("/api/admin/cities", { method: "POST" }); router.refresh(); })}
      className="btn btn-ghost text-[15px]"
    >
      + הוסף עיר
    </button>
  );
}

export function AddPickupButton() {
  const router = useRouter();
  const [, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(async () => { await fetch("/api/admin/pickups", { method: "POST" }); router.refresh(); })}
      className="btn btn-ghost text-[15px]"
    >
      + הוסף נקודת איסוף
    </button>
  );
}
