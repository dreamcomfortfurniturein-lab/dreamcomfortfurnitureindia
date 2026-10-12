import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServiceSupabase, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");
const PENDING_FILE = path.join(process.cwd(), "data", "pending-media.json");

let inMemorySettings: any = null;

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error(e);
  }
  return inMemorySettings || {
    heroVideos: [],
    heroLandscape: { videos: [], poster: {} },
    heroVertical: { videos: [], poster: {} },
  };
}

function saveSettings(settings: any) {
  inMemorySettings = settings;
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    // Tolerated on Vercel serverless read-only
  }
}

async function getPending() {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase.from("pending_media").select("*");
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          createdAt: d.created_at,
          orientation: d.orientation,
          type: d.type,
          mediaUrl: d.media_url,
          title: d.title,
          subtitle: d.subtitle,
          ctaLink: d.cta_link,
          uploaderName: d.uploader_name,
          uploaderPhone: d.uploader_phone,
          approvalCode: d.approval_code,
          status: d.status,
          approvedAt: d.approved_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase query fallback:", e);
    }
  }

  try {
    if (fs.existsSync(PENDING_FILE)) {
      return JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8"));
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

async function markPendingApproved(submissionId: string) {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getServiceSupabase();
      await supabase
        .from("pending_media")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", submissionId);
    } catch (e) {
      console.warn("Supabase approval update error:", e);
    }
  }

  try {
    const list = await getPending();
    const updatedPending = list.map((item: any) =>
      item.id === submissionId
        ? { ...item, status: "approved", approvedAt: new Date().toISOString() }
        : item
    );
    if (fs.existsSync(PENDING_FILE)) {
      fs.writeFileSync(PENDING_FILE, JSON.stringify(updatedPending, null, 2), "utf-8");
    }
  } catch (e) {
    // Vercel serverless
  }
}

async function applyApproval(submission: any) {
  const settings = getSettings();
  const orientation = submission.orientation || "landscape";
  const type = submission.type || "video";

  if (type === "video") {
    if (orientation === "vertical") {
      if (!settings.heroVertical) settings.heroVertical = { videos: [], poster: {} };
      settings.heroVertical.videos = [submission.mediaUrl, ...(settings.heroVertical.videos || [])];
    } else {
      if (!settings.heroLandscape) settings.heroLandscape = { videos: [], poster: {} };
      settings.heroLandscape.videos = [submission.mediaUrl, ...(settings.heroLandscape.videos || [])];
      settings.heroVideos = [submission.mediaUrl, ...(settings.heroVideos || [])];
    }
  } else if (type === "poster") {
    const posterData = {
      badge: "✦ Verified Showcase",
      tag: "Handcrafted Teakwood",
      title: submission.title || "Luxury Furniture Collection",
      subtitle: submission.subtitle || "Direct from artisan workshops in Vizag.",
      ctaText: "Shop The Edit →",
      ctaLink: submission.ctaLink || "/products",
      imageUrl: submission.mediaUrl,
    };

    if (orientation === "vertical") {
      if (!settings.heroVertical) settings.heroVertical = { videos: [], poster: {} };
      settings.heroVertical.poster = posterData;
    } else {
      if (!settings.heroLandscape) settings.heroLandscape = { videos: [], poster: {} };
      settings.heroLandscape.poster = posterData;
    }
  }

  saveSettings(settings);
  await markPendingApproved(submission.id);

  return settings;
}

// 1. GET handler (for 1-click email links from Gmail)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const code = searchParams.get("code");

  if (!id || !code) {
    return new NextResponse(
      renderApprovalHtml({
        success: false,
        title: "Invalid Request",
        message: "Missing submission ID or 6-digit approval code.",
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 400 }
    );
  }

  const pending = await getPending();
  const target = pending.find((item: any) => item.id === id);

  if (!target) {
    return new NextResponse(
      renderApprovalHtml({
        success: false,
        title: "Submission Not Found",
        message: `No pending media submission matching ID: ${id}. It may have already been processed.`,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 404 }
    );
  }

  if (target.approvalCode !== code) {
    return new NextResponse(
      renderApprovalHtml({
        success: false,
        title: "Invalid Security Code",
        message: "The approval code does not match the code issued to Gmail.",
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 403 }
    );
  }

  await applyApproval(target);

  return new NextResponse(
    renderApprovalHtml({
      success: true,
      title: "Media Approved & Published Live!",
      message: `Your ${target.orientation.toUpperCase()} ${target.type.toUpperCase()} ("${target.title}") has been approved and published to the front page hero banner!`,
      details: target,
    }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// 2. POST handler (for in-dashboard 6-digit code entry)
export async function POST(req: NextRequest) {
  try {
    const { id, code } = await req.json();

    if (!id || !code) {
      return NextResponse.json({ error: "Missing ID or approval code." }, { status: 400 });
    }

    const pending = await getPending();
    const target = pending.find((item: any) => item.id === id);

    if (!target) {
      return NextResponse.json({ error: "Pending media submission not found." }, { status: 404 });
    }

    if (target.approvalCode !== code.toString().trim()) {
      return NextResponse.json(
        { error: "Incorrect 6-digit approval code. Please check your Gmail." },
        { status: 403 }
      );
    }

    await applyApproval(target);

    return NextResponse.json({
      success: true,
      message: `Approved and published ${target.type} to the ${target.orientation} hero slot!`,
      submission: target,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Approval failed." }, { status: 500 });
  }
}

function renderApprovalHtml({
  success,
  title,
  message,
  details,
}: {
  success: boolean;
  title: string;
  message: string;
  details?: any;
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title} | Dream Comfort Furniture</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #090E1A;
          color: #FAF6EF;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .card {
          background: #0F172A;
          border: 1px solid ${success ? "#D97706" : "#EF4444"};
          border-radius: 20px;
          padding: 36px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }
        .badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: ${success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
          color: ${success ? "#34D399" : "#F87171"};
          border: 1px solid ${success ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"};
          margin-bottom: 16px;
        }
        h1 { font-size: 24px; margin: 0 0 12px; color: #FAF6EF; }
        p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
        .meta-box {
          background: #090E1A;
          border: 1px solid rgba(217, 119, 6, 0.2);
          border-radius: 12px;
          padding: 16px;
          text-align: left;
          font-size: 12px;
          color: #CBD5E1;
          margin-bottom: 24px;
        }
        .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn-primary { background: linear-gradient(135deg, #F59E0B, #D97706); color: #090E1A; }
        .btn-secondary { background: #1E293B; color: #FAF6EF; border: 1px solid rgba(217, 119, 6, 0.3); }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">${success ? "✓ Approved by Admin" : "⚠️ Notice"}</span>
        <h1>${title}</h1>
        <p>${message}</p>
        ${
          details
            ? `
        <div class="meta-box">
          <div><strong>Dimension:</strong> ${details.orientation === "vertical" ? "Vertical (9:16 Mobile)" : "Landscape (16:9 Desktop)"}</div>
          <div><strong>Type:</strong> ${details.type}</div>
          <div><strong>Title:</strong> ${details.title}</div>
          <div><strong>Submitter:</strong> ${details.uploaderName} (${details.uploaderPhone})</div>
        </div>
        `
            : ""
        }
        <div class="btn-group">
          <a class="btn btn-primary" href="/">View Live Front Page →</a>
          <a class="btn btn-secondary" href="/admin">Open Admin Portal</a>
        </div>
      </div>
    </body>
  </html>
  `;
}
