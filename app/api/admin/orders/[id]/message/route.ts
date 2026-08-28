import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const { channel, templateId } = await req.json().catch(() => ({}));
  if (channel !== "whatsapp" && channel !== "email") {
    return NextResponse.json({ error: "invalid_channel" }, { status: 400 });
  }
  await prisma.messageLog.create({ data: { orderId: id, channel, templateId: templateId || null, byUser: "admin" } });
  return NextResponse.json({ ok: true });
}
