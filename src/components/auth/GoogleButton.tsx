"use client";

import { useEffect, useRef } from "react";

// renders nothing until NEXT_PUBLIC_GOOGLE_CLIENT_ID is set

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const SCRIPT_ID = "google-gsi-client";

export const googleEnabled = GOOGLE_CLIENT_ID.length > 0;

interface GoogleId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleId } };
  }
}

export function GoogleButton({
  onCredential,
}: {
  onCredential: (credential: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleEnabled) return;
    const init = () => {
      const gsi = window.google?.accounts?.id;
      if (!gsi || !ref.current) return;
      gsi.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });
      gsi.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: Math.min(400, ref.current.offsetWidth || 400),
      });
    };

    if (window.google?.accounts?.id) {
      init();
      return;
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", init);
    document.head.appendChild(script);
  }, [onCredential]);

  if (!googleEnabled) return null;
  return <div ref={ref} className="flex min-h-11 justify-center" />;
}
