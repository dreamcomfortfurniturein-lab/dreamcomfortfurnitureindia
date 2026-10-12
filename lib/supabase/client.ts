import { createBrowserClient } from "@supabase/ssr";

// List of known placeholder Supabase domains to avoid placeholder redirects
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
 * If Google Provider is disabled in the Supabase Dashboard, Supabase responds with:
 * {"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
 * This function returns false so the app can fall back to smooth local Google SSO session
 * instead of leaving the user on an ugly raw JSON error page.
 */
export async function isSupabaseOAuthProviderReady(authorizeUrl: string): Promise<boolean> {
  try {
    const res = await fetch(authorizeUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (res.status === 400) {
      const data = await res.json().catch(() => null);
      if (data?.msg?.includes("Unsupported provider") || data?.error_code === "validation_failed") {
        return false;
      }
    }
    return true;
  } catch {
    // If browser redirected or blocked by cross-origin redirect (accounts.google.com),
    // it means the provider is active and attempting to redirect to Google.
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