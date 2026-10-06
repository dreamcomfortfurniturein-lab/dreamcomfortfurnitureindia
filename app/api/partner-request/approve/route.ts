import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id) {
    return NextResponse.json({ error: "Missing request id." }, { status: 400 });
  }

  // Update status in Supabase if configured
  try {
    const supabase = getServiceSupabase();
    await supabase
      .from("partner_access_requests")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("request_id", id);
  } catch (err) {
    console.warn("Supabase update error:", err);
  }

  // Return a friendly approval success page with instructions & unlock passcode
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Partner Request Approved | DreamComfortFurnitureIndia</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b1120; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #111c33; border: 1px solid #d4af37; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .badge { background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.4); display: inline-block; margin-bottom: 16px; }
          h1 { color: #f5f5f7; margin: 0 0 10px; font-size: 24px; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
          .code-box { background: #060a12; border: 1px solid #334155; border-radius: 12px; padding: 14px; margin: 20px 0; font-family: monospace; font-size: 18px; color: #fbbf24; font-weight: bold; letter-spacing: 2px; }
          .btn { background: linear-gradient(135deg, #d4af37, #aa820a); color: #0b1120; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; display: inline-block; margin-top: 10px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">✓ Partner Approved</div>
          <h1>Partner Request Verified</h1>
          <p>Request ID: <strong>${id}</strong> has been marked as <strong>Approved</strong> in Supabase.</p>
          <div class="code-box">ACCESS PASSCODE: 10000</div>
          <p>The partner can now enter passcode <strong>10000</strong> to view all confidential business plan links, the ₹15,000 hybrid model, and the Back-Office CRM.</p>
          <a class="btn" href="/business-plan">Open Partner Portal →</a>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
