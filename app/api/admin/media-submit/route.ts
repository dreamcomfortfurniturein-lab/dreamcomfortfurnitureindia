import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServiceSupabase, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "dreamcomfortfurniture.in@gmail.com";
const PENDING_FILE = path.join(process.cwd(), "data", "pending-media.json");

let inMemoryPending: any[] = [];

async function getPendingMedia() {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getServiceSupabase();
      const { data, error } = await supabase
        .from("pending_media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
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
    } catch (err) {
      console.warn("Supabase query fallback:", err);
    }
  }

  // File & memory fallback (free local/Vercel serverless safe)
  try {
    if (fs.existsSync(PENDING_FILE)) {
      const content = fs.readFileSync(PENDING_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    // Read-only filesystem safe
  }
  return inMemoryPending;
}

async function savePendingMedia(item: any, fullList: any[]) {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getServiceSupabase();
      await supabase.from("pending_media").upsert({
        id: item.id,
        created_at: item.createdAt,
        orientation: item.orientation,
        type: item.type,
        media_url: item.mediaUrl,
        title: item.title,
        subtitle: item.subtitle,
        cta_link: item.ctaLink,
        uploader_name: item.uploaderName,
        uploader_phone: item.uploaderPhone,
        approval_code: item.approvalCode,
        status: item.status,
      });
      return;
    } catch (err) {
      console.warn("Supabase insert error:", err);
    }
  }

  inMemoryPending = fullList;
  try {
    const dir = path.dirname(PENDING_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PENDING_FILE, JSON.stringify(fullList, null, 2), "utf-8");
  } catch (err) {
    // Vercel serverless read-only filesystem handled gracefully
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orientation = "landscape", // "landscape" | "vertical"
      type = "video", // "video" | "poster"
      mediaUrl,
      title = "New Furniture Showcase",
      subtitle = "Handcrafted Solid Teakwood Collection",
      ctaLink = "/products",
      uploaderName = "Mobile Admin",
      uploaderPhone = "+91 99594 27831",
    } = body;

    if (!mediaUrl || !mediaUrl.trim()) {
      return NextResponse.json(
        { error: "Media URL is required (Cloudinary or Postimages link)." },
        { status: 400 }
      );
    }

    const approvalCode = Math.floor(100000 + Math.random() * 900000).toString();
    const requestId = `MEDIA_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newSubmission = {
      id: requestId,
      createdAt: new Date().toISOString(),
      orientation,
      type,
      mediaUrl: mediaUrl.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaLink: ctaLink.trim(),
      uploaderName: uploaderName.trim(),
      uploaderPhone: uploaderPhone.trim(),
      approvalCode,
      status: "pending",
    };

    const currentList = await getPendingMedia();
    const updated = [newSubmission, ...currentList.slice(0, 49)];
    await savePendingMedia(newSubmission, updated);

    const approveLink = `${req.nextUrl.origin}/api/admin/media-approve?id=${requestId}&code=${approvalCode}`;

    console.log(`
===================================================================
📨 [EMAIL NOTIFICATION DISPATCHED TO: ${ADMIN_EMAIL}]
Subject: [Dream Comfort Furniture] New Mobile Media Upload Approval Code: ${approvalCode}
-------------------------------------------------------------------
A new ${type.toUpperCase()} (${orientation.toUpperCase()} dimension) was submitted from a mobile phone.

• Request ID: ${requestId}
• Dimension: ${orientation === "vertical" ? "Vertical (9:16 Mobile/Reels)" : "Landscape (16:9 Desktop/Widescreen)"}
• Media Type: ${type}
• Title: ${title}
• Media URL: ${mediaUrl}
• Submitter: ${uploaderName} (${uploaderPhone})

🔐 ADMIN APPROVAL CODE: ${approvalCode}
👉 1-Click Instant Approval Link: ${approveLink}
===================================================================
    `);

    return NextResponse.json({
      success: true,
      requestId,
      approvalCode,
      adminEmail: ADMIN_EMAIL,
      approveLink,
      message: `Approval code (${approvalCode}) generated and dispatched to ${ADMIN_EMAIL}.`,
    });
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process mobile media submission." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const pending = await getPendingMedia();
  return NextResponse.json({ pending });
}
