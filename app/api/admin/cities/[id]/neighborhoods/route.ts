import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const count = await prisma.deliveryNeighborhood.count({ where: { cityId: id } });
  const nb = await prisma.deliveryNeighborhood.create({ data: { cityId: id, nameHe: "שכונה חדשה", sort: count } });
  return NextResponse.json({ ok: true, neighborhood: nb });
}
