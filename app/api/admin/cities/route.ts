import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const count = await prisma.deliveryCity.count();
  const city = await prisma.deliveryCity.create({
    data: {
      nameHe: "עיר חדשה", active: false, price: 30, minimum: 150, freeOver: 400, sort: count,
      neighborhoods: { create: [{ nameHe: "אחר / לא ברשימה", sort: 0 }] },
    },
  });
  return NextResponse.json({ ok: true, city });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, patch } = await req.json().catch(() => ({}));
  if (!id || !patch) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (typeof patch.nameHe === "string") data.nameHe = patch.nameHe;
  if (typeof patch.active === "boolean") data.active = patch.active;
  if (typeof patch.price === "number") data.price = patch.price;
  if (typeof patch.minimum === "number") data.minimum = patch.minimum;
  if (typeof patch.freeOver === "number") data.freeOver = patch.freeOver;
  const city = await prisma.deliveryCity.update({ where: { id }, data });
  return NextResponse.json({ ok: true, city });
}
