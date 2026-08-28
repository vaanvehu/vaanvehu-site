import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order-number";

interface OrderLineInput {
  kind: "set" | "product";
  name: string;
  image?: string | null;
  unitPrice: number;
  qty: number;
  extrasText?: string;
  pitamChoice?: string | null;
  note?: string;
}

interface OrderInput {
  lang: "he" | "en" | "fr";
  customer: { name: string; phone: string; email?: string };
  lines: OrderLineInput[];
  fulfillment: "pickup" | "delivery";
  pickupPointId?: string | null;
  delivery?: { city: string; neighborhood: string; street: string; house: string; apt?: string; floor?: string; note?: string };
  paymentMethod: "bit" | "paybox" | "card";
  note?: string;
}

export async function POST(req: NextRequest) {
  let body: OrderInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body?.customer?.name?.trim() || !body?.customer?.phone?.trim()) {
    return NextResponse.json({ error: "missing_customer" }, { status: 400 });
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }
  if (body.fulfillment === "pickup" && !body.pickupPointId) {
    return NextResponse.json({ error: "missing_pickup_point" }, { status: 400 });
  }
  if (body.fulfillment === "delivery") {
    const d = body.delivery;
    if (!d?.city || !d?.neighborhood || !d?.street?.trim() || !d?.house?.trim()) {
      return NextResponse.json({ error: "missing_delivery_address" }, { status: 400 });
    }
  }
  if (!["bit", "paybox", "card"].includes(body.paymentMethod)) {
    return NextResponse.json({ error: "missing_payment_method" }, { status: 400 });
  }

  const total = body.lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);
  const number = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      number,
      lang: body.lang,
      customerName: body.customer.name.trim(),
      customerPhone: body.customer.phone.trim(),
      customerEmail: body.customer.email?.trim() || null,
      total,
      fulfillmentType: body.fulfillment,
      pickupPointId: body.fulfillment === "pickup" ? body.pickupPointId : null,
      deliveryCity: body.fulfillment === "delivery" ? body.delivery?.city : null,
      deliveryNeighborhood: body.fulfillment === "delivery" ? body.delivery?.neighborhood : null,
      street: body.fulfillment === "delivery" ? body.delivery?.street : null,
      house: body.fulfillment === "delivery" ? body.delivery?.house : null,
      apt: body.fulfillment === "delivery" ? body.delivery?.apt || null : null,
      floor: body.fulfillment === "delivery" ? body.delivery?.floor || null : null,
      addressNote: body.fulfillment === "delivery" ? body.delivery?.note || null : null,
      paymentMethod: body.paymentMethod,
      paymentStatus: "unpaid",
      status: "new",
      note: body.note?.trim() || null,
      lines: {
        create: body.lines.map((l) => ({
          kind: l.kind,
          name: l.name,
          image: l.image ?? null,
          unitPrice: l.unitPrice,
          qty: l.qty,
          extrasText: l.extrasText || null,
          pitamChoice: l.pitamChoice || null,
          note: l.note || null,
        })),
      },
    },
  });

  return NextResponse.json({ number: order.number, id: order.id, total: order.total });
}
