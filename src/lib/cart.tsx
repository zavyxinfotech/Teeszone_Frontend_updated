"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// one line = product + color + size
export interface CartItem {
  key: string; // `${slug}|${color}|${size}`
  slug: string;
  name: string;
  image: string;
  colorName: string;
  colorHex: string;
  size: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  note: string; // branding note (logo filename / print text)
  addItems: (items: Omit<CartItem, "key">[], note?: string) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
  totalItems: number;
}

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "teeszone-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage after mount (lazy init would break hydration)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; note?: string };
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (typeof parsed.note === "string") setNote(parsed.note);
      }
    } catch {
      // corrupted storage, start fresh
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, note }));
  }, [items, note, hydrated]);

  const addItems = useCallback(
    (newItems: Omit<CartItem, "key">[], addNote?: string) => {
      setItems((prev) => {
        const next = [...prev];
        for (const item of newItems) {
          const key = `${item.slug}|${item.colorName}|${item.size}`;
          const existing = next.find((i) => i.key === key);
          if (existing) existing.qty = Math.min(9999, existing.qty + item.qty);
          else next.push({ ...item, key });
        }
        return next;
      });
      if (addNote) setNote(addNote);
    },
    [],
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(9999, qty) } : i)),
    );
  }, []);

  const removeItem = useCallback(
    (key: string) => setItems((prev) => prev.filter((i) => i.key !== key)),
    [],
  );

  const clear = useCallback(() => {
    setItems([]);
    setNote("");
  }, []);

  const totalItems = useMemo(
    () => items.reduce((a, i) => a + i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, note, addItems, updateQty, removeItem, setNote, clear, totalItems }),
    [items, note, addItems, updateQty, removeItem, clear, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
