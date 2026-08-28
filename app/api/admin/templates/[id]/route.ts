import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const { subject, body: msgBody } = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof subject === "string") data.subject = subject;
  if (typeof msgBody === "string") data.body = msgBody;
  const template = await prisma.messageTemplate.update({ where: { id }, data });
  return NextResponse.json({ ok: true, template });
}
