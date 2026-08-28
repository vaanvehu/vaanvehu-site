import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, setAdminCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD || "vaanvehu";
  if (typeof password !== "string" || password.trim().toLowerCase() !== expected.trim().toLowerCase()) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }
  const token = await createAdminSession();
  await setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
