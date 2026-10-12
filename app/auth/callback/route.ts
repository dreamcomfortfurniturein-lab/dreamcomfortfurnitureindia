import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const userEmail = data?.user?.email?.trim().toLowerCase();

    // If a specific next path was requested, honor it
    if (next && next !== "/") {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Role-based portal direct routing
    if (userEmail === "dreamcomfortfurniture.in@gmail.com") {
      return NextResponse.redirect(`${origin}/admin`);
    } else if (userEmail) {
      return NextResponse.redirect(`${origin}/customer`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}