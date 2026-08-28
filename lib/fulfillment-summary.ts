import type { Lang } from "@/lib/i18n";
import { pickField } from "@/lib/i18n";
import type { CheckoutState } from "@/lib/checkout-types";

const PREFIX: Record<Lang, { pickup: string; delivery: string; apt: string }> = {
  he: { pickup: "איסוף עצמי – ", delivery: "משלוח לכתובת: ", apt: ", דירה " },
  en: { pickup: "Self-Pickup – ", delivery: "Delivery to: ", apt: ", apt " },
  fr: { pickup: "Retrait – ", delivery: "Livraison à : ", apt: ", appart. " },
};

export interface PickupRow { id: string; [k: string]: unknown }
export interface NeighborhoodRow { nameHe: string; [k: string]: unknown }
export interface CityRow { nameHe: string; neighborhoods: NeighborhoodRow[]; [k: string]: unknown }

export function fulfillmentSummaryText(
  lang: Lang,
  state: CheckoutState,
  pickupPoints: PickupRow[],
  cities: CityRow[]
): string {
  const p = PREFIX[lang];
  if (state.fulfillment === "pickup") {
    const pt = pickupPoints.find((pp) => pp.id === state.pickupPointId);
    if (!pt) return "";
    return `${p.pickup}${pickField(pt, "name", lang)}, ${pickField(pt, "address", lang)}`;
  }
  if (state.fulfillment === "delivery") {
    const city = cities.find((c) => c.nameHe === state.delivery.city);
    const nb = city?.neighborhoods.find((n) => n.nameHe === state.delivery.neighborhood);
    const cityName = city ? pickField(city, "name", lang) : state.delivery.city;
    const nbName = nb ? pickField(nb, "name", lang) : state.delivery.neighborhood;
    const apt = state.delivery.apt ? `${p.apt}${state.delivery.apt}` : "";
    return `${p.delivery}${state.delivery.street} ${state.delivery.house}${apt}, ${nbName}, ${cityName}`;
  }
  return "";
}
