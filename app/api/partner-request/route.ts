import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, notes, requestedAmount = 10000 } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const approvalToken = `TOK_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    // 1. Try to record into Supabase partner_access_requests table if database is provisioned
    try {
      const supabase = getServiceSupabase();
      await supabase.from("partner_access_requests").insert([
        {
          request_id: requestId,
          name,
          phone,
          email: email || null,
          notes: notes || null,
          requested_amount: requestedAmount,
          status: "pending",
          approval_token: approvalToken,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (dbErr) {
      // Non-blocking fallback if supabase table or credentials are being configured
      console.warn("Supabase insert notice (using server fallback token):", dbErr);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamcomfortfurniture.in";
    // 2. Prepare pre-filled WhatsApp link for mandatory WhatsApp alert to 9347965863
    const waText = encodeURIComponent(
      `Hello Admin,\n\nA customer has requested access to Dream Comfort Partner Portal:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n✉️ Email: ${email || "Not provided"}\n💰 Requested Deposit: ₹${requestedAmount.toLocaleString("en-IN")}\n🔖 Request ID: ${requestId}\n\nMandatory Admin Approval is required before Partner Portal access can be unlocked.\nApprove here: ${siteUrl}/admin`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919347965863&text=${waText}`;

    // 3. Prepare Gmail approval mailto link for Admin notification & quick approval response
    const adminEmail = "dreamcomfortfurniture.in@gmail.com";
    const mailSubject = encodeURIComponent(`[URGENT APPROVAL REQUIRED] Partner Portal Access Request - ${name} (${requestId})`);
    const mailBody = encodeURIComponent(
      `Hello Admin,\n\nA user has requested Partner Portal Access at Dream Comfort Furniture India:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "N/A"}\nRequested Amount: ₹${requestedAmount.toLocaleString("en-IN")}\nRequest ID: ${requestId}\n\nIMPORTANT: The Partner Portal is locked for this user until you approve them.\n\nTo approve this user, open your Admin Dashboard:\n${siteUrl}/admin\n\nCustomer WhatsApp: https://wa.me/91${phone.replace(/\D/g, "")}`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${mailSubject}&body=${mailBody}`;
    const defaultMailto = `mailto:${adminEmail}?subject=${mailSubject}&body=${mailBody}`;

    return NextResponse.json({
      success: true,
      requestId,
      approvalToken,
      whatsappUrl,
      gmailUrl,
      defaultMailto,
      message: "Partner request created successfully. Connect via WhatsApp or Gmail for admin approval.",
    });
  } catch (err: any) {
    console.error("Partner request error:", err);
    return NextResponse.json(
      { error: "Could not create partner request." },
      { status: 500 }
    );
  }
}
