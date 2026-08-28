export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface DeliveryInfo {
  city: string;
  neighborhood: string;
  street: string;
  house: string;
  apt: string;
  floor: string;
  note: string;
}

export type FulfillmentType = "pickup" | "delivery" | null;
export type PaymentMethodId = "bit" | "paybox" | "card" | null;

export interface CheckoutState {
  customer: CustomerInfo;
  fulfillment: FulfillmentType;
  pickupPointId: string | null;
  delivery: DeliveryInfo;
  paymentMethod: PaymentMethodId;
  orderNote: string;
}

export const EMPTY_CHECKOUT: CheckoutState = {
  customer: { name: "", phone: "", email: "" },
  fulfillment: null,
  pickupPointId: null,
  delivery: { city: "", neighborhood: "", street: "", house: "", apt: "", floor: "", note: "" },
  paymentMethod: null,
  orderNote: "",
};
