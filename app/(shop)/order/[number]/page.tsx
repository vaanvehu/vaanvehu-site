import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderConfirmation from "./OrderConfirmation";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) notFound();
  return <OrderConfirmation number={order.number} />;
}
