"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/lib/cart-types";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  hydrated: boolean;
  addOrInc: (line: Omit<CartLine, "qty">) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  qtyFor: (key: string) => number;
  qtyForPrefix: (prefix: string) => number;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "va_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, hydrated]);

  const addOrInc = (line: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.key === line.key);
      if (existing) return prev.map((l) => (l.key === line.key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { ...line, qty: 1 }];
    });
  };

  const updateQty = (key: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l)).filter((l) => l.qty > 0));
  };

  const inc = (key: string) => setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));
  const dec = (key: string) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0));
  const remove = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key));
  const clear = () => setLines([]);
  const qtyFor = (key: string) => lines.find((l) => l.key === key)?.qty ?? 0;
  const qtyForPrefix = (prefix: string) => lines.filter((l) => l.key.startsWith(prefix)).reduce((a, l) => a + l.qty, 0);

  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);

  const value = useMemo<CartContextValue>(
    () => ({ lines, count, total, hydrated, addOrInc, inc, dec, updateQty, remove, qtyFor, qtyForPrefix, clear }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lines, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
