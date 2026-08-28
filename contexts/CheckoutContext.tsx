"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_CHECKOUT, type CheckoutState, type CustomerInfo, type DeliveryInfo } from "@/lib/checkout-types";

interface CheckoutContextValue {
  state: CheckoutState;
  hydrated: boolean;
  setCustomer: (patch: Partial<CustomerInfo>) => void;
  setFulfillment: (type: "pickup" | "delivery") => void;
  setPickupPointId: (id: string) => void;
  setDelivery: (patch: Partial<DeliveryInfo>) => void;
  setPaymentMethod: (id: "bit" | "paybox" | "card") => void;
  setOrderNote: (note: string) => void;
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);
const STORAGE_KEY = "va_checkout";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(EMPTY_CHECKOUT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (raw) setState({ ...EMPTY_CHECKOUT, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      state,
      hydrated,
      setCustomer: (patch) => setState((s) => ({ ...s, customer: { ...s.customer, ...patch } })),
      setFulfillment: (type) => setState((s) => ({ ...s, fulfillment: type })),
      setPickupPointId: (id) => setState((s) => ({ ...s, pickupPointId: id })),
      setDelivery: (patch) => setState((s) => ({ ...s, delivery: { ...s.delivery, ...patch } })),
      setPaymentMethod: (id) => setState((s) => ({ ...s, paymentMethod: id })),
      setOrderNote: (note) => setState((s) => ({ ...s, orderNote: note })),
      reset: () => setState(EMPTY_CHECKOUT),
    }),
    [state, hydrated]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
