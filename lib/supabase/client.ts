import { createBrowserClient } from "@supabase/ssr";

// List of known placeholder or non-existent Supabase domains to avoid DNS crashes
const PLACEHOLDER_SUPABASE_HOSTS = [
  "placeholder-project.supabase.co",
  "your-project-id.supabase.co",
];

export function isUnreachableSupabaseHost(url?: string | null): boolean {
  if (!url) return true;
  return PLACEHOLDER_SUPABASE_HOSTS.some((host) => url.toLowerCase().includes(host.toLowerCase()));
}

/**
 * Preflights the Supabase OAuth authorize URL.
 * Returns false if:
 * 1. Host is non-existent (DNS_PROBE_FINISHED_NXDOMAIN)
 * 2. Supabase Google Provider is disabled (code 400 validation_failed)
 * 3. Network or connection timed out
 * This allows the app to fallback to smooth Google SSO session without crashing with a browser DNS error.
 */
export async function isSupabaseOAuthProviderReady(authorizeUrl: string): Promise<boolean> {
  if (isUnreachableSupabaseHost(authorizeUrl)) {
    console.warn("[DCF Auth] Supabase host is marked as unreachable. Falling back.");
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    // CRITICAL: use redirect: "manual" so browser doesn't follow 302 to accounts.google.com,
    // which would trigger a cross-origin CORS violation in preflight fetch requests!
    const res = await fetch(authorizeUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "manual",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Opaque redirect (302 to accounts.google.com) or 200/302 confirms Google OAuth is active!
    if (res.type === "opaqueredirect" || res.status === 302 || res.status === 200) {
      return true;
    }

    if (res.status === 400) {
      const data = await res.json().catch(() => null);
      if (data?.msg?.includes("Unsupported provider") || data?.error_code === "validation_failed") {
        console.warn("[DCF Auth] Supabase Google Provider disabled in dashboard. Falling back.");
        return false;
      }
    }
    return true;
  } catch (err: any) {
    // If the browser intercepted cross-origin redirection (e.g. CORS/opaque redirect error),
    // the provider is active and attempting to redirect to Google accounts.
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("abort") || isUnreachableSupabaseHost(authorizeUrl)) {
      console.warn("[DCF Auth] Preflight failed for Supabase OAuth URL:", err?.message || err);
      return false;
    }
    return true;
  }
}

/**
 * Returns true if real, valid Supabase credentials are configured in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder") || key.includes("placeholder")) return false;
  if (url.includes("your-project-id")) return false;
  if (!url.startsWith("https://")) return false;
  if (isUnreachableSupabaseHost(url)) return false;
  return true;
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url =
    isSupabaseConfigured() && rawUrl
      ? rawUrl
      : "https://placeholder-project.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";
  return createBrowserClient(url, key);
}