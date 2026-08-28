"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";

export default function AdvanceStatusButton({ orderId, next, label }: { orderId: string; next: OrderStatus; label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await fetch(`/api/admin/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: next }),
          });
          router.refresh();
        })
      }
      className="btn btn-primary text-[15px]"
    >
      {label}
    </button>
  );
}
