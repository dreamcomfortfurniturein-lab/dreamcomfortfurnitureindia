"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
  isUnreachableSupabaseHost,
  isSupabaseOAuthProviderReady,
} from "@/lib/supabase/client";
import {
  getCurrentAuthUser,
  isSuperAdminEmail,
  loginWithGoogleAccount,
  signOutGoogleUser,
  extractFirstName,
  generateWelcomeGmailUrl,
  SUPER_ADMIN_EMAIL,
  DCFAuthUser,
} from "@/lib/auth-session";
import { WELCOME_QUOTES, getRandomQuote, WelcomeQuote } from "@/lib/quotes";

export default function SignUpPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<DCFAuthUser | null>(null);
  const [currentQuote, setCurrentQuote] = useState<WelcomeQuote>(WELCOME_QUOTES[0]);
  const [videoDimension, setVideoDimension] = useState<"landscape" | "vertical">("landscape");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customGmail, setCustomGmail] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Video assets
  const landscapeVideo = {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    title: "Cinema Landscape: Flagship Showroom & Kiln Seasoning Process",
  };

  const verticalVideo = {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    title: "Vertical Reel: Master Artisan Hand-Carving & White-Glove Installation",
  };

  useEffect(() => {
    // Pick a random welcoming quote on every page load/visit
    setCurrentQuote(getRandomQuote());

    // Check if user is already signed in via local storage
    const user = getCurrentAuthUser();
    if (user) {
      setAuthUser(user);
    }

    // Sync active Supabase session
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const meta = session.user.user_metadata || {};
        const fullName =
          meta.full_name ||
          meta.name ||
          meta.given_name ||
          session.user.email.split("@")[0];
        const avatar = meta.avatar_url || meta.picture || undefined;
        const logged = loginWithGoogleAccount(session.user.email, fullName, avatar);
        setAuthUser(logged);
      }
    });
  }, []);

  function handleNextQuote() {
    let next = getRandomQuote();
    while (next.id === currentQuote.id && WELCOME_QUOTES.length > 1) {
      next = getRandomQuote();
    }
    setCurrentQuote(next);
  }

  async function handleGoogleSignUp(emailToUse?: string, displayName?: string) {
    setError("");
    setLoading(true);

    const email = (emailToUse || customGmail || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      setError("Please enter your Google / Gmail account (e.g. yourname@gmail.com).");
      setLoading(false);
      return;
    }

    try {
      handleNextQuote();
      const user = loginWithGoogleAccount(email, displayName);

      // Open welcoming message in Gmail
      try {
        const welcomeUrl = generateWelcomeGmailUrl({
          email: user.email,
          name: user.name,
        });
        if (typeof window !== "undefined") {
          window.open(welcomeUrl, "_blank");
        }
      } catch {
        // popup fallback
      }

      setTimeout(() => {
        setLoading(false);
        if (isSuperAdminEmail(user.email)) {
          router.push("/admin");
        } else {
          router.push("/customer");
        }
        router.refresh();
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to sign up with Google.");
    }
  }

  return (
    <main className="bg-navy-950 text-sand-100 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-gold selection:text-navy-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold via-amber-500 to-teak flex items-center justify-center shadow-xl shadow-gold/20 border border-gold/60 group-hover:scale-105 transition-all">
              <span className="text-navy-950 font-black font-display text-2xl leading-none">DC</span>
            </div>
            <div className="text-left">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sand-50 tracking-wide">
                Dream Comfort Furniture India
              </h1>
              <span className="text-[10px] sm:text-xs text-gold/90 font-mono tracking-widest uppercase block">
                Handcrafted Luxury Solid Wood Living • Direct Workshop Pricing
              </span>
            </div>
          </Link>
        </div>

        {/* Dynamic Welcoming Quote Card (Changes on every visit) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-gold/30 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[11px] font-semibold">
              <span>{currentQuote.mood}</span>
              <span>•</span>
              <span>{currentQuote.context}</span>
            </div>

            <p className="font-serif italic text-base sm:text-xl text-sand-100 leading-relaxed px-4">
              &ldquo;{currentQuote.quote}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-sand-300/70 pt-1">
              <span className="font-semibold text-gold">— {currentQuote.author}</span>
              <span>•</span>
              <button
                onClick={handleNextQuote}
                className="text-[11px] text-sand-400 hover:text-gold flex items-center gap-1 transition-colors"
                title="Roll another inspirational quote"
              >
                <span>✦ Next Quote</span>
              </button>
            </div>
          </div>
        </div>

        {/* IF USER IS ALREADY SIGNED IN: ONLY ACCOUNT & LOG OUT */}
        {authUser ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-2xl space-y-6 bg-navy-900/90 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold mx-auto flex items-center justify-center text-2xl border border-gold/40">
              {isSuperAdminEmail(authUser.email) ? "👑" : "🛍️"}
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-sand-50">
                Welcome, {extractFirstName(authUser.name || authUser.email)}!
              </h2>
              <p className="text-xs text-sand-300/70">
                You are securely connected via Google (<span className="text-gold font-mono">{authUser.email}</span>).
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href={isSuperAdminEmail(authUser.email) ? "/admin" : "/customer"}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Open Your Account Portal →</span>
              </Link>
              <button
                onClick={async () => {
                  signOutGoogleUser();
                  try {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  } catch {}
                  setAuthUser(null);
                }}
                className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-red-950/40 text-sand-300 hover:text-red-300 border border-sand-300/20 hover:border-red-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Split Grid: Left = Video Showcase & Highlights | Right = Google Sign-Up Box */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Horizontal & Vertical Videos + Brand Highlights (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Dimension Video Toggle */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border border-gold/30 bg-navy-900/80 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/15 pb-4">
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-sand-50">
                    Workshop & Showroom Showcase
                  </h2>
                  <p className="text-xs text-sand-300/70">
                    Watch our master artisans season timber, hand-carve solid teak, and furnish luxury homes.
                  </p>
                </div>

                {/* Dimension Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-950 border border-gold/20 shrink-0">
                  <button
                    onClick={() => setVideoDimension("landscape")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      videoDimension === "landscape"
                        ? "bg-gold text-navy-900 shadow-md shadow-gold/20 font-bold"
                        : "text-sand-300 hover:text-white"
                    }`}
                  >
                    <span>🖥️ Landscape (16:9)</span>
                  </button>
                  <button
                    onClick={() => setVideoDimension("vertical")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      videoDimension === "vertical"
                        ? "bg-gold text-navy-900 shadow-md shadow-gold/20 font-bold"
                        : "text-sand-300 hover:text-white"
                    }`}
                  >
                    <span>📱 Vertical (9:16)</span>
                  </button>
                </div>
              </div>

              {/* Video Player Display */}
              {videoDimension === "landscape" ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-950 border border-gold/30 shadow-2xl">
                    <video
                      src={landscapeVideo.url}
                      poster={landscapeVideo.poster}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md text-[10px] text-gold font-bold border border-gold/30">
                      16:9 Cinema Landscape
                    </div>
                  </div>
                  <p className="text-xs text-sand-300/70 italic text-center">
                    {landscapeVideo.title}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-navy-950 border border-gold/30 shadow-2xl">
                    <video
                      src={verticalVideo.url}
                      poster={verticalVideo.poster}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md text-[10px] text-gold font-bold border border-gold/30">
                      9:16 Vertical Reel
                    </div>
                  </div>
                  <p className="text-xs text-sand-300/70 italic text-center">
                    {verticalVideo.title}
                  </p>
                </div>
              )}
            </div>

            {/* Brief Things What Will Be Inside (Brand Highlights) */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border border-gold/20 bg-navy-900/60 shadow-xl space-y-4">
              <h3 className="font-display text-base font-bold text-sand-50 flex items-center gap-2">
                <span>✨</span>
                <span>What Awaits You Inside Dream Comfort</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-gold/15 space-y-1">
                  <div className="flex items-center gap-2 text-gold font-bold">
                    <span>🪵</span>
                    <span>100% Solid Seasoned Timber</span>
                  </div>
                  <p className="text-sand-300/70 text-[11px] leading-relaxed">
                    Certified CP Teak & Royal Sheesham dried in 45-day solar kilns to 8-10% core moisture. Zero composite board or veneers.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-gold/15 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>🛡️</span>
                    <span>10-Year Termite Proof Guarantee</span>
                  </div>
                  <p className="text-sand-300/70 text-[11px] leading-relaxed">
                    3-stage chemical vacuum pressure impregnation backed by an authentic factory certificate of longevity.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-gold/15 space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <span>🎁</span>
                    <span>Exclusive Member Discounts</span>
                  </div>
                  <p className="text-sand-300/70 text-[11px] leading-relaxed">
                    Unlock instant 25% festive launch vouchers, king bed bundles, and private access to our custom furniture design team.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-gold/15 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <span>🚚</span>
                    <span>White-Glove Doorstep Assembly</span>
                  </div>
                  <p className="text-sand-300/70 text-[11px] leading-relaxed">
                    Nationwide cushioned transport, room placement, and hydraulic bed assembly handled by our trained carpenters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cool Google Sign-Up Box (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-2xl space-y-6 bg-navy-900/90 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40">
                  Step 1: Guided Sign-Up
                </span>
                <h2 className="font-display text-2xl font-bold text-sand-50">
                  Create Your Free Account
                </h2>
                <p className="text-xs text-sand-300/70 leading-relaxed">
                  Join verified shoppers enjoying direct-from-kiln luxury furniture pricing and private member rewards.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                  {error}
                </div>
              )}

                {/* Google Email Input & Action */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-sand-200 block text-left">
                      Your Google / Gmail Account
                    </label>
                    <input
                      type="email"
                      value={customGmail}
                      onChange={(e) => setCustomGmail(e.target.value)}
                      placeholder="e.g. rahul.sharma@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-gold/30 text-sand-100 placeholder-sand-500 text-xs focus:border-gold focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleGoogleSignUp()}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-xl hover:shadow-2xl border border-slate-200 active:scale-[0.99] disabled:opacity-50"
                  >
                    {/* Google G Logo */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>
                      {loading ? "Connecting to Google..." : "Connect & Sign Up via Google"}
                    </span>
                  </button>

                  <p className="text-[11px] text-sand-300/60 text-center">
                    Instant connection • Welcoming message prepared in Gmail.
                  </p>
                </div>

                {/* Already Have An Account Link */}
                <div className="pt-4 border-t border-gold/15 text-center text-xs text-sand-300/80">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-gold font-bold hover:underline ml-1"
                  >
                    Go to Sign In →
                  </Link>
                </div>
              </div>

              {/* Security Guarantee Note */}
              <div className="p-4 rounded-2xl bg-navy-900/60 border border-gold/15 text-[11px] text-sand-300/60 space-y-1 text-center">
                <p>🔒 100% Protected by Google OAuth • No Passwords Stored</p>
                <p>Direct kiln-to-doorstep ordering with genuine teakwood certification.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}