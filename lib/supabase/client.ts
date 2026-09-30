import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
<<<<<<< HEAD
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient(url, key);
=======
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
>>>>>>> 93c68c8f6ca2074aa2a21e81f297c62136768a2e
}