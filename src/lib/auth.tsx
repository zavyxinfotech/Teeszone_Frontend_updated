"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, type AuthSession } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

// token lives in localStorage, profile is always re-fetched from /auth/me

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  ready: boolean; // false until the stored session has been checked
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "teeszone-auth-v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // restore session after mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let cancelled = false;
    const stored = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
      } catch {
        return null;
      }
    })();
    if (!stored) {
      setReady(true);
      return;
    }
    authApi
      .me(stored)
      .then((profile) => {
        if (cancelled) return;
        setToken(stored);
        setUserState(profile);
      })
      .catch(() => {
        // expired/invalid token, drop the session
        if (!cancelled) localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const adopt = useCallback((session: AuthSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: session.token }));
    setToken(session.token);
    setUserState(session.user);
    return session.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => adopt(await authApi.login({ email, password })),
    [adopt],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) =>
      adopt(await authApi.register({ name, email, password })),
    [adopt],
  );

  const loginWithGoogle = useCallback(
    async (credential: string) => adopt(await authApi.google(credential)),
    [adopt],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUserState(null);
  }, []);

  const setUser = useCallback((next: AuthUser) => setUserState(next), []);

  const value = useMemo(
    () => ({ user, token, ready, login, register, loginWithGoogle, logout, setUser }),
    [user, token, ready, login, register, loginWithGoogle, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// redirect to /login once the session check finishes with no user
export function useRequireAuth() {
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, user, router, pathname]);

  return { user, token, ready };
}
