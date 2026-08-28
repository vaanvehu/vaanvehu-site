import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <AdminSidebar />
      <div className="flex-1 pt-7 px-4.5 vd:px-7.5 pb-16 min-w-0">{children}</div>
    </div>
  );
}
