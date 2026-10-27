"use client";

export const SUPER_ADMIN_EMAIL = "dreamcomfortfurniture.in@gmail.com";

export type UserRole = "super_admin" | "distributor" | "customer";
export type SessionViewMode = "customer" | "distributor";
export type PartnerApprovalStatus = "approved" | "pending" | "unrequested";

export interface DCFAuthUser {
  email: string;
  name: string;
  role: UserRole;
  partnerStatus: PartnerApprovalStatus;
  avatarUrl?: string;
  distributorId?: string;
}

const STORAGE_KEYS = {
  EMAIL: "dcf_auth_email",
  NAME: "dcf_auth_name",
  ROLE: "dcf_auth_role",
  SESSION_MODE: "dcf_active_session_mode",
  AVATAR: "dcf_auth_avatar",
  SESSION_START: "dcf_session_start",
  SESSION_EXPIRES_AT: "dcf_session_expires_at",
  EXPIRED_REASON: "dcf_session_expired_reason",
};

/**
 * Get the public site URL, avoiding internal localhost in live production.
 */
export function getPublicSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://dreamcomfortfurniture.in";
}

/**
 * Session time helper - friendly display for logged-in sessions.
 */
export function getSessionTimeRemainingSeconds(): number {
  return 7200;
}

export function formatTimeRemaining(totalSeconds: number): string {
  return "Active";
}

export function getLastExpiredReason(): string | null {
  return null;
}

export function clearExpiredReason(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.EXPIRED_REASON);
}

/**
 * Check if the given email is the Super Admin.
 */
export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Extract clean, friendly first name from full name or email address.
 */
export function extractFirstName(fullNameOrEmail?: string | null): string {
  if (!fullNameOrEmail) return "User";
  const trimmed = fullNameOrEmail.trim();
  if (isSuperAdminEmail(trimmed)) {
    return "Director";
  }
  if (trimmed.includes("@")) {
    const local = trimmed.split("@")[0];
    const first = local.split(/[._-]/)[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length > 0 && parts[0]) {
    if (["mr.", "mrs.", "ms.", "dr."].includes(parts[0].toLowerCase()) && parts[1]) {
      return parts[1];
    }
    return parts[0];
  }
  return trimmed;
}

export function computeUserRole(email: string | null | undefined): UserRole {
  if (!email) return "customer";
  const normalized = email.trim().toLowerCase();
  if (isSuperAdminEmail(normalized)) {
    return "super_admin";
  }
  return "customer";
}

export function getPartnerStatus(email: string | null | undefined): {
  status: PartnerApprovalStatus;
  distributorRecord?: any;
} {
  return { status: "approved" };
}

/**
 * Get current authenticated user profile from browser storage.
 */
export function getCurrentAuthUser(): DCFAuthUser | null {
  if (typeof window === "undefined") return null;

  const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
  if (!email) return null;

  const role = computeUserRole(email);
  const name =
    localStorage.getItem(STORAGE_KEYS.NAME) ||
    email.split("@")[0];

  return {
    email,
    name,
    role,
    partnerStatus: "approved",
    avatarUrl: localStorage.getItem(STORAGE_KEYS.AVATAR) || undefined,
  };
}

/**
 * Perform Google Authentication / SSO Sign In.
 */
export function loginWithGoogleAccount(
  email: string,
  name?: string,
  avatarUrl?: string
): DCFAuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const userName = name || normalizedEmail.split("@")[0];
  const role = computeUserRole(normalizedEmail);

  if (typeof window !== "undefined") {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.EMAIL, normalizedEmail);
    localStorage.setItem(STORAGE_KEYS.NAME, userName);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    localStorage.setItem(STORAGE_KEYS.SESSION_START, now.toString());
    localStorage.setItem(STORAGE_KEYS.SESSION_MODE, "customer");
    localStorage.removeItem(STORAGE_KEYS.EXPIRED_REASON);

    if (avatarUrl) {
      localStorage.setItem(STORAGE_KEYS.AVATAR, avatarUrl);
    }

    window.dispatchEvent(new Event("dcf_auth_change"));
  }

  return {
    email: normalizedEmail,
    name: userName,
    role,
    partnerStatus: "approved",
    avatarUrl,
  };
}

/**
 * Sign out user and clear session.
 */
export function signOutGoogleUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.EMAIL);
  localStorage.removeItem(STORAGE_KEYS.NAME);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.AVATAR);
  localStorage.removeItem(STORAGE_KEYS.SESSION_START);
  localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  localStorage.setItem(STORAGE_KEYS.SESSION_MODE, "customer");
  window.dispatchEvent(new Event("dcf_auth_change"));
}

export const ADMIN_WHATSAPP_NUMBER = "919959427831"; // Founder Pranay WhatsApp
export const ADMIN_WHATSAPP_NUMBER_2 = "919347965863";
export const ADMIN_EMAIL_ADDRESS = "dreamcomfortfurniture.in@gmail.com";

export interface PartnerNotificationUrls {
  requestId: string;
  whatsappUrl: string;
  gmailUrl: string;
  mailtoUrl: string;
  waText: string;
}

/**
 * Consultation or inquiry notification helper.
 */
export function generatePartnerNotificationUrls(params: {
  name: string;
  email: string;
  phone: string;
  requestId?: string;
  notes?: string;
}): PartnerNotificationUrls {
  const requestId = params.requestId || `ENQ_${Date.now()}`;
  const timeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const waText = `Hi Pranay,

I am interested in furniture from Dream Comfort Furniture India:
👤 Name: ${params.name}
✉️ Email: ${params.email}
📞 Phone: ${params.phone}
⏰ Time: ${timeStr}
🔖 Reference: ${requestId}
${params.notes ? `📝 Details: ${params.notes}\n` : ""}
Please contact me to discuss designs and showroom pricing.`;

  const mailSubject = `Furniture Consultation Inquiry: ${params.name}`;
  const mailBody = `Hello Pranay & Dream Comfort Team,

A customer has requested a furniture consultation:

👤 Name: ${params.name}
✉️ Email: ${params.email}
📞 Phone: ${params.phone}
⏰ Time: ${timeStr}
🔖 Reference: ${requestId}
${params.notes ? `📝 Details: ${params.notes}\n` : ""}`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(waText)}`;
  const mailtoUrl = `mailto:${ADMIN_EMAIL_ADDRESS}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL_ADDRESS}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return { requestId, whatsappUrl, gmailUrl, mailtoUrl, waText };
}

/**
 * Generate a pre-filled welcoming Gmail message for the customer.
 */
export function generateWelcomeGmailUrl(params: {
  email: string;
  name?: string;
}): string {
  const firstName = extractFirstName(params.name || params.email);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://dreamcomfortfurniture.in";
  const subject = `Welcome to Dream Comfort Furniture India, ${firstName}! 🛋️✨`;
  const body = `Dear ${firstName},

Welcome to Dream Comfort Furniture India! 🌟

Your account (${params.email}) has been successfully connected.

Exclusive Benefits For You:
🎁 25% Welcome Discount on your first solid wood order (Code: WELCOME25)
🪵 100% Seasoned CP Teakwood & Sheesham Craftsmanship
🚚 Free Pan-India Doorstep Delivery & White-Glove Carpenter Assembly
🛡️ Official 10-Year Anti-Termite & Structural Guarantee

Browse our handcrafted collections:
${siteUrl}/products

Need custom dimensions, fabric selection, or live showroom video walkthrough?
📞 WhatsApp: +91 99594 27831 / +91 93479 65863
✉️ Email: ${ADMIN_EMAIL_ADDRESS}

Warm regards,
Dream Comfort Furniture India
Handcrafted Solid Wood Luxury Living`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(params.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function submitPartnerAccessRequest(
  email: string,
  name: string,
  phone: string = "+91 99594 27831"
): void {
  // Silent fallback
}

export function approvePartnerByAdmin(distributorIdOrEmail: string): void {
  // Silent fallback
}

export function getActiveSessionMode(): SessionViewMode {
  return "customer";
}

export function setActiveSessionMode(mode: SessionViewMode): void {
  // No-op
}
