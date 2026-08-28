"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "דשבורד" },
  { href: "/admin/orders", label: "הזמנות" },
  { href: "/admin/catalog", label: "מוצרים" },
  { href: "/admin/customers", label: "לקוחות" },
  { href: "/admin/deliveries", label: "משלוחים" },
  { href: "/admin/settings", label: "הגדרות" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="w-[250px] flex-none border-l flex flex-col gap-1.5 py-6.5 px-4.5" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
      <div className="flex items-center gap-2.5 mb-2">
        <img src="/assets/logo-gold-sm-w.jpg" alt="וְאַנְוֵהוּ" className="h-[34px] w-auto" />
        <div className="font-[var(--font-heading)] text-[23px] leading-[1.1]" style={{ color: "var(--brand-green)" }}>בקרה ושליטה</div>
      </div>
      <div className="h-px mb-2.5" style={{ background: "var(--color-divider)" }} />
      {NAV.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className="text-right py-3.5 px-3.5 font-[var(--font-heading)] text-[22px] no-underline border-e-[3px]"
            style={{
              background: active ? "color-mix(in srgb, var(--color-accent-100) 55%, transparent)" : "transparent",
              borderColor: active ? "var(--color-accent)" : "transparent",
              color: active ? "var(--brand-green)" : "var(--color-text)",
            }}
          >
            {n.label}
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="h-px my-2.5" style={{ background: "var(--color-divider)" }} />
      <Link href="/" className="text-[15px] no-underline">← חזרה לאתר</Link>
      <button onClick={logout} className="btn btn-ghost justify-center mt-2.5 text-[16px]">יציאה</button>
    </div>
  );
}
