"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import { logCustomerActivity } from "@/lib/activity";

const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010/api";

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
  customNote?: string;
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

const GUEST_STORAGE_KEY = "teeszone-cart-guest";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  // Storage key is strictly isolated per logged-in user
  const storageKey = user?.id
    ? `teeszone-cart-u-${user.id}`
    : GUEST_STORAGE_KEY;

  // Hydrate cart when active user changes or on first mount
  useEffect(() => {
    const prevUserId = previousUserIdRef.current;
    previousUserIdRef.current = user?.id;

    // Detect guest login -> merge guest cart into user account cart
    if (prevUserId === null && user?.id) {
      try {
        const guestRaw = localStorage.getItem(GUEST_STORAGE_KEY);
        const userRaw = localStorage.getItem(`teeszone-cart-u-${user.id}`);

        let guestItems: CartItem[] = [];
        let guestNote = "";
        if (guestRaw) {
          const parsedGuest = JSON.parse(guestRaw);
          if (Array.isArray(parsedGuest.items)) guestItems = parsedGuest.items;
          if (typeof parsedGuest.note === "string") guestNote = parsedGuest.note;
        }

        let userItems: CartItem[] = [];
        let userNote = "";
        if (userRaw) {
          const parsedUser = JSON.parse(userRaw);
          if (Array.isArray(parsedUser.items)) userItems = parsedUser.items;
          if (typeof parsedUser.note === "string") userNote = parsedUser.note;
        }

        // Merge guest items into user cart
        const merged = [...userItems];
        for (const gi of guestItems) {
          const existing = merged.find((m) => m.key === gi.key);
          if (existing) {
            existing.qty = Math.min(9999, existing.qty + gi.qty);
          } else {
            merged.push(gi);
          }
        }

        const mergedNote = guestNote || userNote;
        setItems(merged);
        setNote(mergedNote);

        // Clean up guest cart so next guest/user never sees it
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.setItem(
          `teeszone-cart-u-${user.id}`,
          JSON.stringify({ items: merged, note: mergedNote })
        );
        setHydrated(true);
        return;
      } catch {
        // Fallback to normal hydration on error
      }
    }

    // Normal hydration for current user or guest
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; note?: string };
        setItems(Array.isArray(parsed.items) ? parsed.items : []);
        setNote(typeof parsed.note === "string" ? parsed.note : "");
      } else {
        setItems([]);
        setNote("");
      }
    } catch {
      setItems([]);
      setNote("");
    }
    setHydrated(true);
  }, [storageKey, user?.id]);

  // Sync with backend database when user is logged in
  useEffect(() => {
    if (!token || !user?.id) return;
    let cancelled = false;

    fetch(`${CLIENT_API_URL}/cart`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.data?.items) return;
        const remoteItems = data.data.items as CartItem[];
        if (remoteItems.length > 0) {
          setItems(remoteItems);
          try {
            localStorage.setItem(storageKey, JSON.stringify({ items: remoteItems, note }));
          } catch {}
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [token, user?.id, storageKey, note]);

  // Save changes to user-specific localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ items, note }));
    } catch {}

    // Sync to backend if logged in
    if (token && user?.id) {
      fetch(`${CLIENT_API_URL}/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, note }),
      }).catch(() => {});
    }
  }, [items, note, hydrated, storageKey, token, user?.id]);

  const addItems = useCallback(
    (newItems: Omit<CartItem, "key">[], addNote?: string) => {
      setItems((prev) => {
        const next = [...prev];
        for (const item of newItems) {
          const key = `${item.slug}|${item.colorName}|${item.size}`;
          const existing = next.find((i) => i.key === key);
          if (existing) existing.qty = Math.min(9999, existing.qty + item.qty);
          else next.push({ ...item, key });

          // Log customer activity for administrators
          logCustomerActivity({
            activityType: "CART_ADD",
            productId: item.slug,
            productName: item.name,
            details: {
              color: item.colorName,
              size: item.size,
              qty: item.qty,
              customNote: addNote || item.customNote || "",
            },
          });
        }
        return next;
      });
      if (addNote) setNote(addNote);
    },
    []
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (target) {
        logCustomerActivity({
          activityType: qty <= 0 ? "CART_REMOVE" : "CART_QTY",
          productId: target.slug,
          productName: target.name,
          details: { key, newQty: qty, previousQty: target.qty },
        });
      }
      return qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(9999, qty) } : i));
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (target) {
        logCustomerActivity({
          activityType: "CART_REMOVE",
          productId: target.slug,
          productName: target.name,
          details: { key, color: target.colorName, size: target.size },
        });
      }
      return prev.filter((i) => i.key !== key);
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setNote("");
    logCustomerActivity({
      activityType: "CART_CLEAR",
      details: { timestamp: new Date().toISOString() },
    });
  }, []);

  const totalItems = useMemo(
    () => items.reduce((a, i) => a + i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, note, addItems, updateQty, removeItem, setNote, clear, totalItems }),
    [items, note, addItems, updateQty, removeItem, setNote, clear, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
