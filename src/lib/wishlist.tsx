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
import { useAuth } from "@/lib/auth";

const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010/api";

interface WishlistState {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string, productName?: string) => void;
  remove: (slug: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistState | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Storage key is strictly isolated per logged-in user
  const storageKey = user?.id
    ? `teeszone-wishlist-u-${user.id}`
    : "teeszone-wishlist-guest";

  // Hydrate from localStorage whenever active user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setSlugs(parsed.filter((s) => typeof s === "string"));
        } else {
          setSlugs([]);
        }
      } else {
        setSlugs([]);
      }
    } catch {
      setSlugs([]);
    }
    setHydrated(true);
  }, [storageKey]);

  // Sync with backend database when logged in
  useEffect(() => {
    if (!token || !user?.id) return;
    let cancelled = false;

    fetch(`${CLIENT_API_URL}/likes`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.data?.slugs) return;
        const remoteSlugs = data.data.slugs as string[];
        setSlugs(remoteSlugs);
        try {
          localStorage.setItem(storageKey, JSON.stringify(remoteSlugs));
        } catch {}
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [token, user?.id, storageKey]);

  // Persist to user-specific localStorage key
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(slugs));
    } catch {}
  }, [slugs, hydrated, storageKey]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback(
    (slug: string, productName?: string) => {
      setSlugs((prev) => {
        const next = prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [...prev, slug];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });

      // Persist to backend database for logged-in user
      if (token) {
        fetch(`${CLIENT_API_URL}/likes/toggle`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productSlug: slug,
            productName: productName || slug,
          }),
        }).catch(() => {});
      }
    },
    [token, storageKey],
  );

  const remove = useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        const next = prev.filter((s) => s !== slug);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });

      // If item was liked in backend, toggle it off
      if (token) {
        fetch(`${CLIENT_API_URL}/likes/toggle`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productSlug: slug }),
        }).catch(() => {});
      }
    },
    [token, storageKey],
  );

  const value = useMemo(
    () => ({ slugs, has, toggle, remove, count: slugs.length }),
    [slugs, has, toggle, remove],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistState {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
