import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Determine origin based on forwarded headers or request URL
  const forwardedHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  let origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : request.nextUrl.origin;

  // In production deployments, ensure we never accidentally bounce to localhost
  if (
    (process.env.NODE_ENV === "production" || process.env.VERCEL) &&
    (!origin || origin.includes("localhost") || origin.includes("127.0.0.1"))
  ) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    origin = siteUrl && !siteUrl.includes("localhost")
      ? siteUrl
      : "https://dreamcomfortfurniture.in";
  }

  // Handle OAuth provider errors (e.g. Rate limits, quota exceeded, or session expired)
  if (error || errorDescription) {
    const desc = (errorDescription || error || "").toLowerCase();
    const isRateLimitOrFreeOver =
      desc.includes("rate_limit") ||
      desc.includes("quota") ||
      desc.includes("too_many") ||
      desc.includes("over_quota");
    const reason = isRateLimitOrFreeOver ? "free_limit_over" : "session_expired";

    return NextResponse.redirect(
      `${origin}/login?reason=${reason}&error=${encodeURIComponent(
        error || "oauth_error"
      )}&desc=${encodeURIComponent(errorDescription || "")}`
    );
  }

  if (code) {
    try {
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

      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        const desc = exchangeError.message.toLowerCase();
        const reason =
          desc.includes("expired") || desc.includes("invalid")
            ? "session_expired"
            : "auth_error";
        return NextResponse.redirect(
          `${origin}/login?reason=${reason}&error=${encodeURIComponent(
            exchangeError.message
          )}`
        );
      }

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
    } catch {
      // In case of unexpected session exception, redirect with session expired notice
      return NextResponse.redirect(`${origin}/login?reason=session_expired`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}