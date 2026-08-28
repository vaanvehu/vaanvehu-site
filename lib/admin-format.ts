import type { Order, OrderLine, OrderStatus } from "@prisma/client";
import { waHref, telHref } from "@/lib/whatsapp";

export const STATUS_ORDER: OrderStatus[] = ["new", "in_process", "ready", "out_for_delivery", "delivered", "cancelled"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "התקבלה",
  in_process: "בהכנה",
  ready: "מוכן",
  out_for_delivery: "יצא למשלוח",
  delivered: "נמסר",
  cancelled: "בוטלה",
};

export const STATUS_TINT: Record<OrderStatus, string> = {
  new: "color-mix(in srgb, var(--color-accent-100) 60%, transparent)",
  in_process: "color-mix(in srgb, #e8dcc0 55%, transparent)",
  ready: "color-mix(in srgb, #cfe3d4 55%, transparent)",
  out_for_delivery: "color-mix(in srgb, #d6e2ef 60%, transparent)",
  delivered: "color-mix(in srgb, #cfe3d4 75%, transparent)",
  cancelled: "color-mix(in srgb, #e3cfcf 60%, transparent)",
};

export const STATUS_EDGE: Record<OrderStatus, string> = {
  new: "var(--color-accent-300)",
  in_process: "#c9a24a",
  ready: "#4f8a63",
  out_for_delivery: "#5b7fa6",
  delivered: "var(--brand-green)",
  cancelled: "#8f2b2b",
};

export const LANG_LABEL: Record<string, string> = { he: "עברית", en: "English", fr: "Français" };
export const PAYMENT_LABEL = { paid: "שולם", unpaid: "ממתין" } as const;

export function nextStatus(status: OrderStatus): OrderStatus {
  const idx = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 2)]; // never auto-advance into "cancelled"
}

export function orderAddress(order: Pick<Order, "fulfillmentType" | "street" | "house" | "apt" | "floor" | "deliveryNeighborhood" | "deliveryCity">, pickupLabel?: string): string {
  if (order.fulfillmentType === "delivery") {
    const aptPart = order.apt ? `, דירה ${order.apt}` : "";
    const floorPart = order.floor ? `, קומה ${order.floor}` : "";
    return `${order.street ?? ""} ${order.house ?? ""}${aptPart}${floorPart}, ${order.deliveryNeighborhood ?? ""}, ${order.deliveryCity ?? ""}`;
  }
  return pickupLabel ?? "";
}

export function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}

export function orderWaLink(phone: string, name: string, number: string): string {
  return waHref(phone, `שלום ${name}, לגבי הזמנה #${number} מוְאַנְוֵהוּ`);
}

export function orderTelLink(phone: string): string {
  return telHref(phone);
}

export function fillTemplate(text: string, vars: { name: string; number: string; total: number; status: string }): string {
  return text
    .split("{שם}").join(vars.name)
    .split("{מספר}").join(vars.number)
    .split("{סכום}").join(`₪${vars.total}`)
    .split("{סטטוס}").join(vars.status);
}

export type OrderWithLines = Order & { lines: OrderLine[] };
