import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const count = await prisma.pickupPoint.count();
  const point = await prisma.pickupPoint.create({
    data: { nameHe: "נקודת איסוף חדשה", addressHe: "", hoursHe: "", phone: "", note: "", active: false, sort: count },
  });
  return NextResponse.json({ ok: true, point });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, patch } = await req.json().catch(() => ({}));
  if (!id || !patch) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data: Record<string, unknown> = {};
  for (const key of ["nameHe", "addressHe", "hoursHe", "phone", "note"]) {
    if (typeof patch[key] === "string") data[key] = patch[key];
  }
  if (typeof patch.active === "boolean") data.active = patch.active;
  const point = await prisma.pickupPoint.update({ where: { id }, data });
  return NextResponse.json({ ok: true, point });
}
