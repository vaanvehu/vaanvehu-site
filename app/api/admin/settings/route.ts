import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.businessEmail === "string") data.businessEmail = body.businessEmail;
  if (typeof body.whatsappNumber === "string") data.whatsappNumber = body.whatsappNumber;
  if (typeof body.autoSend === "boolean") data.autoSend = body.autoSend;

  const settings = await prisma.settings.upsert({ where: { id: 1 }, update: data, create: { id: 1, businessEmail: "orders@vaanvehu.co.il", whatsappNumber: "052-6665954", autoSend: true, ...data } });
  return NextResponse.json({ ok: true, settings });
}
