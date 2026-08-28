import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Model = "set" | "etrogType" | "grade" | "product" | "setUpgrade";

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { model, id, patch } = (await req.json().catch(() => ({}))) as { model?: Model; id?: string; patch?: Record<string, unknown> };
  if (!model || !id || !patch) return NextResponse.json({ error: "invalid_body" }, { status: 400 });

  const clean: Record<string, unknown> = {};
  if (typeof patch.nameHe === "string") clean.nameHe = patch.nameHe;
  if (typeof patch.price === "number") clean.price = patch.price;
  if (typeof patch.active === "boolean") clean.active = patch.active;
  if (typeof patch.image === "string") clean.image = patch.image;

  try {
    switch (model) {
      case "set": await prisma.setProduct.update({ where: { id }, data: clean }); break;
      case "etrogType": await prisma.etrogType.update({ where: { id }, data: clean }); break;
      case "grade": await prisma.grade.update({ where: { id }, data: clean }); break;
      case "product": await prisma.product.update({ where: { id }, data: clean }); break;
      case "setUpgrade": await prisma.setUpgrade.update({ where: { id }, data: clean }); break;
      default: return NextResponse.json({ error: "unknown_model" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
