import { prisma } from "@/lib/prisma";

export async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const num = `VN-${Math.floor(10000 + Math.random() * 89999)}`;
    const existing = await prisma.order.findUnique({ where: { number: num } });
    if (!existing) return num;
  }
  // astronomically unlikely fallback
  return `VN-${Date.now().toString().slice(-8)}`;
}
