"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OrderSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const apply = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (v) params.set("q", v);
    else params.delete("q");
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="flex gap-2.5 mb-4 max-w-[520px]">
      <input
        className="input text-[17px] py-3 px-3.5"
        placeholder="חיפוש: מספר הזמנה, שם, טלפון, כתובת"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") apply(value); }}
        onBlur={() => apply(value)}
      />
    </div>
  );
}
