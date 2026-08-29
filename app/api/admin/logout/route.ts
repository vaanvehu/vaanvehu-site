import { NextResponse } from "next/server";
import { clearAdminCookie, getClientIp, logAdminAction } from "@/lib/admin-auth";

export async function POST() {
  const ip = await getClientIp();
  await clearAdminCookie();
  await logAdminAction("logout", undefined, ip);
  return NextResponse.json({ ok: true });
}
