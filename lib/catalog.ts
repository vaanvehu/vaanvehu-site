import { prisma } from "@/lib/prisma";

export const SET_COVER_IMAGE = "assets/etrog-lulav.jpg";

export async function getSets() {
  return prisma.setProduct.findMany({
    where: { active: true },
    orderBy: { sort: "asc" },
    include: { upgrades: { orderBy: { sort: "asc" } } },
  });
}

export async function getSet(id: string) {
  return prisma.setProduct.findUnique({
    where: { id },
    include: { upgrades: { orderBy: { sort: "asc" } } },
  });
}

export async function getGrades() {
  return prisma.grade.findMany({ where: { active: true }, orderBy: { sort: "asc" } });
}

export async function getEtrogTypes() {
  return prisma.etrogType.findMany({ where: { active: true }, orderBy: { sort: "asc" } });
}

export async function getProductsByCategory(categories: string[]) {
  return prisma.product.findMany({
    where: { active: true, category: { in: categories } },
    orderBy: { sort: "asc" },
  });
}

export async function getPickupPoints() {
  return prisma.pickupPoint.findMany({ where: { active: true }, orderBy: { sort: "asc" } });
}

export async function getDeliveryCities() {
  return prisma.deliveryCity.findMany({
    where: { active: true },
    orderBy: { sort: "asc" },
    include: { neighborhoods: { orderBy: { sort: "asc" } } },
  });
}

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (settings) return settings;
  return prisma.settings.create({
    data: { id: 1, businessEmail: "orders@vaanvehu.co.il", whatsappNumber: "052-6665954", autoSend: true },
  });
}
