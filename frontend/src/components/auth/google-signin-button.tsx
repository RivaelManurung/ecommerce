"use client";

import { useEffect, useRef } from "react";

type GoogleCredentialResponse = { credential: string };

interface GoogleIdApi {
  accounts: {
    id: {
      initialize(cfg: { client_id: string; callback: (r: GoogleCredentialResponse) => void }): void;
      renderButton(el: HTMLElement, opts: Record<string, unknown>): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdApi;
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";

/**
 * Renders the official Google Identity Services button. Loads the GIS script
 * once, hands the returned ID token to `onCredential` (which exchanges it with
 * our backend). Render nothing unless a client ID is configured.
 */
export function GoogleSignInButton({
  clientId,
  onCredential,
}: {
  clientId: string;
  onCredential: (idToken: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);
  cb.current = onCredential;

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (r) => cb.current(r.credential),
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 320,
      });
    };

    if (window.google) {
      render();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
    };
  }, [clientId]);

  return <div ref={ref} className="flex justify-center" />;
}
