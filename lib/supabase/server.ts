import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const INVALID_SUPABASE_HOSTS = [
  "dawjbqptuthqoeaowobl.supabase.co",
  "placeholder-project.supabase.co",
  "your-project-id.supabase.co",
];

/**
 * Returns true if real, valid Supabase credentials exist for server-side operations.
 */
export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder") || key.includes("placeholder")) return false;
  if (url.includes("your-project-id")) return false;
  if (!url.startsWith("https://")) return false;
  if (INVALID_SUPABASE_HOSTS.some((host) => url.toLowerCase().includes(host.toLowerCase()))) {
    return false;
  }
  return true;
}

export function getServiceSupabase() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url =
    isSupabaseServerConfigured() && rawUrl
      ? rawUrl
      : "https://placeholder-project.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";
  return createSupabaseClient(url, serviceKey);
}
