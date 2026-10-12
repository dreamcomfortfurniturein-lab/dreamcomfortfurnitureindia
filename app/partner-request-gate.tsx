"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DCFAuthUser,
  ADMIN_WHATSAPP_NUMBER,
  ADMIN_EMAIL_ADDRESS,
  generatePartnerNotificationUrls,
  submitPartnerAccessRequest,
} from "@/lib/auth-session";

interface PartnerRequestGateProps {
  authUser: DCFAuthUser;
  portalName?: string;
  source?: string;
  onStatusChange?: () => void;
}

export default function PartnerRequestGate({
  authUser,
  portalName = "Partner Portal",
  source = "partner-gate",
  onStatusChange,
}: PartnerRequestGateProps) {
  const [phone, setPhone] = useState("+91 ");
  const [notes, setNotes] = useState("");
  const [isPending, setIsPending] = useState(
    authUser.partnerStatus === "pending"
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastDispatched, setLastDispatched] = useState<"whatsapp" | "gmail" | null>(null);

  // Generate current pre-filled URLs based on user details
  const notificationUrls = generatePartnerNotificationUrls({
    name: authUser.name,
    email: authUser.email,
    phone: phone.trim().length > 4 ? phone.trim() : "+91 9347965863",
    notes: notes.trim() || `Requested via ${portalName} (${source})`,
  });

  async function handleSendRequest(channel: "whatsapp" | "gmail") {
    const finalPhone = phone.trim().length > 4 ? phone.trim() : "+91 9347965863";

    // 1. Log request in local state & storage
    submitPartnerAccessRequest(authUser.email, authUser.name, finalPhone);
    setIsPending(true);
    setLastDispatched(channel);

    // 2. Notify backend
    try {
      await fetch("/api/partner-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authUser.name,
          email: authUser.email,
          phone: finalPhone,
          notes: notes.trim() || `Submitted via ${channel.toUpperCase()} from ${portalName}`,
        }),
      });
    } catch {
      // offline fallback
    }

    // 3. Open selected channel directly
    if (channel === "whatsapp") {
      setSuccessMessage(
        `Opening WhatsApp (+91 9347965863)... Send the pre-filled message to request access approval.`
      );
      try {
        window.open(notificationUrls.whatsappUrl, "_blank");
      } catch {
        // pop-up blocker fallback
      }
    } else {
      setSuccessMessage(
        `Opening Gmail (${ADMIN_EMAIL_ADDRESS})... Send the pre-filled email from your Gmail account to request access approval.`
      );
      try {
        window.open(notificationUrls.gmailUrl, "_blank");
      } catch {
        // pop-up blocker fallback
      }
    }

    if (onStatusChange) {
      onStatusChange();
    }
  }

  return (
    <div className="max-w-xl w-full mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/40 text-center space-y-6 shadow-2xl bg-navy-900/95 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Status Badge & Icon */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-300 mx-auto flex items-center justify-center text-3xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
          {isPending ? "⏳" : "🔒"}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{isPending ? "Awaiting Master Admin Approval" : "Portal Access Restricted"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-sand-50">
          {portalName}
        </h1>
        <p className="text-xs sm:text-sm text-sand-300/80 leading-relaxed max-w-md mx-auto">
          The {portalName} is strictly reserved for Admin-Approved Distributors. Every Google account defaults to the <strong>Customer</strong> role and cannot enter until approved by Master Admin (
          <span className="text-gold font-mono">{ADMIN_EMAIL_ADDRESS}</span>).
        </p>
      </div>

      {/* User Identity Details Box */}
      <div className="p-4 rounded-2xl bg-navy-950/80 border border-gold/20 text-left text-xs space-y-2">
        <div className="text-[11px] font-semibold text-sand-400 uppercase tracking-wider mb-1">
          Your Account Verification Details:
        </div>
        <div className="flex items-center justify-between py-1 border-b border-navy-800">
          <span className="text-sand-300">Google Account:</span>
          <span className="font-mono text-gold font-semibold truncate max-w-[230px]">
            {authUser.email}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-navy-800">
          <span className="text-sand-300">Account Name:</span>
          <span className="text-sand-100 font-semibold">{authUser.name}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sand-300">Current Role:</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase">
            {authUser.role === "distributor" ? "Distributor" : "Customer (Default)"}
          </span>
        </div>
      </div>

      {/* Editable Phone Input */}
      <div className="text-left space-y-1.5">
        <label className="block text-xs font-semibold text-sand-200">
          Your Contact Phone Number (Required for WhatsApp & Admin verification):
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 9347965863"
          className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-sand-100 font-mono focus:outline-none focus:border-gold transition-colors"
        />
        <p className="text-[10px] text-sand-400">
          This number will be included in the message so Founder/Admin can verify your request.
        </p>
      </div>

      {/* Optional City/Notes */}
      <div className="text-left space-y-1.5">
        <label className="block text-xs font-semibold text-sand-200">
          City / Location (Optional):
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Hyderabad / Vijayawada / Bangalore"
          className="w-full bg-navy-950 border border-gold/30 rounded-xl px-3.5 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Alert / Success Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs text-left space-y-1 animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5 text-emerald-300">
            <span>✓</span>
            <span>Request Logged Successfully</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{successMessage}</p>
        </div>
      )}

      {isPending && !successMessage && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs text-left space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <span>⏳</span>
            <span>Request Pending Master Admin Approval</span>
          </div>
          <p className="text-[11px] leading-relaxed text-sand-300/90">
            Your request has been registered in the system. The Partner Portal will open as soon as Master Admin approves it. You can send or re-send your request via WhatsApp or Gmail below:
          </p>
        </div>
      )}

      {/* PRIMARY ACTION BUTTONS: WHATSAPP OR GMAIL */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-semibold text-sand-300 uppercase tracking-wider text-center">
          Choose How to Send Your Approval Request:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WHATSAPP ACTION BUTTON */}
          <button
            type="button"
            onClick={() => handleSendRequest("whatsapp")}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-navy-950 border border-[#25D366]/40 hover:border-[#25D366] shadow-lg shadow-[#25D366]/10 hover:shadow-[#25D366]/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              {/* WhatsApp SVG Icon */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="font-bold text-xs sm:text-sm">
                Send via WhatsApp
              </span>
            </div>
            <span className="text-[10px] opacity-80 font-mono">
              Admin: +91 9347965863
            </span>
            <span className="text-[9px] mt-1 px-2 py-0.5 rounded-full bg-[#25D366]/20 group-hover:bg-navy-950/20 font-medium">
              Opens WhatsApp with pre-filled message →
            </span>
          </button>

          {/* GMAIL ACTION BUTTON */}
          <button
            type="button"
            onClick={() => handleSendRequest("gmail")}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#EA4335]/15 hover:bg-[#EA4335] text-[#EA4335] hover:text-white border border-[#EA4335]/40 hover:border-[#EA4335] shadow-lg shadow-[#EA4335]/10 hover:shadow-[#EA4335]/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-1">
              {/* Gmail Envelope SVG Icon */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.49l8.073-5.997C21.69 2.279 24 3.434 24 5.457z" />
              </svg>
              <span className="font-bold text-xs sm:text-sm">
                Send via Gmail
              </span>
            </div>
            <span className="text-[10px] opacity-80 font-mono truncate max-w-[200px]">
              {ADMIN_EMAIL_ADDRESS}
            </span>
            <span className="text-[9px] mt-1 px-2 py-0.5 rounded-full bg-[#EA4335]/20 group-hover:bg-white/20 font-medium">
              Opens your Gmail Compose tab →
            </span>
          </button>
        </div>

        {/* Fallback to Default Native Mail Client */}
        <div className="pt-2 text-center">
          <a
            href={notificationUrls.mailtoUrl}
            className="text-[11px] text-sand-400 hover:text-gold transition-colors underline decoration-dotted"
          >
            Or open default desktop mail client (Outlook / Apple Mail)
          </a>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs text-sand-300">
        <Link href="/customer" className="hover:text-gold transition-colors flex items-center gap-1">
          <span>←</span>
          <span>Customer Portal</span>
        </Link>
        <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
          <span>Storefront</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
