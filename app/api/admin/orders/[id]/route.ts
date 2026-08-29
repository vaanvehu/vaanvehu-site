import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, getClientIp, logAdminAction } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (body.status) data.status = body.status;
  if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
  if (typeof body.note === "string") data.note = body.note;

  const order = await prisma.order.update({ where: { id }, data });
  await logAdminAction("order_update", `order=${order.number} ${JSON.stringify(data)}`, await getClientIp());
  return NextResponse.json({ ok: true, order });
}
