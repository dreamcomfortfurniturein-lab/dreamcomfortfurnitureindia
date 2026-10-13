"use client";

import initialDistributorsData from "@/data/distributors.json";

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
  DISTRIBUTORS: "dcf_admin_distributors",
  AVATAR: "dcf_auth_avatar",
  SESSION_START: "dcf_session_start",
  SESSION_EXPIRES_AT: "dcf_session_expires_at",
  EXPIRED_REASON: "dcf_session_expired_reason",
};

// Default Free Session Time Limit: 2 Hours (7200 seconds)
export const DEFAULT_SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

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
 * Get remaining session time in seconds. Returns 0 if expired or unauthenticated.
 */
export function getSessionTimeRemainingSeconds(): number {
  if (typeof window === "undefined") return 0;
  const expiresAtStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  if (!expiresAtStr) return 0;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt)) return 0;
  const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  return remaining;
}

/**
 * Format seconds into a friendly MM:SS or HH:MM:SS string.
 */
export function formatTimeRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get last session expiration reason (e.g. "session_expired" or "time_limit_over").
 */
export function getLastExpiredReason(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.EXPIRED_REASON);
}

/**
 * Clear session expired notice after user dismisses or acknowledges it.
 */
export function clearExpiredReason(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.EXPIRED_REASON);
}

/**
 * Check if the given email is the Super Admin.
 * STRICT ENFORCEMENT: Only dreamcomfortfurniture.in@gmail.com is Super Admin.
 */
export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Extract clean, friendly first name from full name or email address.
 * E.g., "Rajeshwar Rao" -> "Rajeshwar", "meera.venkat@gmail.com" -> "Meera"
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

/**
 * Get current distributors registry (merges initialDistributorsData to guarantee latest active partners).
 */
export function getDistributorsRegistry(): any[] {
  if (typeof window === "undefined") return initialDistributorsData;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISTRIBUTORS);
    let list: any[] = raw ? JSON.parse(raw) : [...initialDistributorsData];
    if (!Array.isArray(list)) list = [...initialDistributorsData];

    // Smart merge: Ensure all active partners in initialDistributorsData (e.g. skylimits306@gmail.com)
    // are ALWAYS marked Active even if an older localStorage cache exists!
    for (const initDist of initialDistributorsData as any[]) {
      const idx = list.findIndex(
        (d: any) => d.email && d.email.toLowerCase() === initDist.email.toLowerCase()
      );
      if (idx === -1) {
        list.unshift(initDist);
      } else if (initDist.status === "Active" && list[idx].status !== "Active") {
        list[idx] = { ...list[idx], ...initDist, status: "Active" };
      }
    }

    // Explicitly guarantee skylimits306@gmail.com is Active
    const skyIdx = list.findIndex(
      (d: any) => d.email && d.email.toLowerCase() === "skylimits306@gmail.com"
    );
    if (skyIdx === -1) {
      list.unshift({
        id: "DC934812",
        name: "Sky Limits",
        email: "skylimits306@gmail.com",
        phone: "+91 93479 65863",
        rank: "Gold Leader",
        status: "Active",
        bv: 150000,
        pv: 150,
        joinedDate: "13 Oct 2026",
        permissions: ["Full Network Access", "Direct Selling Leader", "Weekly Payouts"],
      });
    } else {
      list[skyIdx].status = "Active";
    }

    localStorage.setItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(list));
    return list;
  } catch {
    return initialDistributorsData;
  }
}

/**
 * Determine a user's partner/distributor approval status.
 */
export function getPartnerStatus(email: string | null | undefined): {
  status: PartnerApprovalStatus;
  distributorRecord?: any;
} {
  if (!email) return { status: "unrequested" };
  const normalized = email.trim().toLowerCase();

  if (isSuperAdminEmail(normalized)) {
    return { status: "approved" };
  }

  // Explicit approval guarantee for approved distributor: skylimits306@gmail.com
  if (normalized === "skylimits306@gmail.com") {
    const record = {
      id: "DC934812",
      name: "Sky Limits",
      email: "skylimits306@gmail.com",
      phone: "+91 93479 65863",
      rank: "Gold Leader",
      status: "Active",
      bv: 150000,
      pv: 150,
      joinedDate: "13 Oct 2026",
      permissions: ["Full Network Access", "Direct Selling Leader", "Weekly Payouts"],
    };
    return { status: "approved", distributorRecord: record };
  }

  const distributors = getDistributorsRegistry();
  const matched = distributors.find(
    (d: any) => d.email && d.email.toLowerCase() === normalized
  );

  if (!matched) {
    return { status: "unrequested" };
  }

  if (matched.status === "Active") {
    return { status: "approved", distributorRecord: matched };
  }

  if (matched.status === "Pending") {
    return { status: "pending", distributorRecord: matched };
  }

  return { status: "unrequested", distributorRecord: matched };
}

/**
 * Compute the effective user role based on email and admin approval.
 * 1. dreamcomfortfurniture.in@gmail.com -> super_admin
 * 2. approved by dreamcomfortfurniture.in@gmail.com -> distributor
 * 3. All other Google emails -> customer (default)
 */
export function computeUserRole(email: string | null | undefined): UserRole {
  if (!email) return "customer";
  const normalized = email.trim().toLowerCase();

  if (isSuperAdminEmail(normalized)) {
    return "super_admin";
  }

  const { status } = getPartnerStatus(normalized);
  if (status === "approved") {
    return "distributor";
  }

  // DEFAULT ROLE: EVERY other Google email gets Customer
  return "customer";
}

/**
 * Get current authenticated user profile from browser storage.
 * Enforces automatic session expiration if the free time limit has ended.
 */
export function getCurrentAuthUser(): DCFAuthUser | null {
  if (typeof window === "undefined") return null;

  const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
  if (!email) return null;

  // Session Time Limit Expiration Enforcement
  const expiresAtStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT);
  if (expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr, 10);
    if (!isNaN(expiresAt) && Date.now() > expiresAt) {
      // Time limit is over: invalidate session and set expiration notice
      localStorage.setItem(STORAGE_KEYS.EXPIRED_REASON, "session_expired");
      signOutGoogleUser();
      return null;
    }
  }

  const role = computeUserRole(email);
  const { status, distributorRecord } = getPartnerStatus(email);
  const name =
    localStorage.getItem(STORAGE_KEYS.NAME) ||
    distributorRecord?.name ||
    email.split("@")[0];

  return {
    email,
    name,
    role,
    partnerStatus: status,
    avatarUrl: localStorage.getItem(STORAGE_KEYS.AVATAR) || undefined,
    distributorId: distributorRecord?.id,
  };
}

/**
 * Perform Google Authentication / SSO Sign In.
 * Sets session start timestamp and automatic free session time limit.
 */
export function loginWithGoogleAccount(
  email: string,
  name?: string,
  avatarUrl?: string
): DCFAuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const userName = name || normalizedEmail.split("@")[0];
  const role = computeUserRole(normalizedEmail);
  const { status, distributorRecord } = getPartnerStatus(normalizedEmail);

  if (typeof window !== "undefined") {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.EMAIL, normalizedEmail);
    localStorage.setItem(STORAGE_KEYS.NAME, userName);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    localStorage.setItem(STORAGE_KEYS.SESSION_START, now.toString());
    localStorage.setItem(
      STORAGE_KEYS.SESSION_EXPIRES_AT,
      (now + DEFAULT_SESSION_DURATION_MS).toString()
    );
    localStorage.removeItem(STORAGE_KEYS.EXPIRED_REASON);

    if (avatarUrl) {
      localStorage.setItem(STORAGE_KEYS.AVATAR, avatarUrl);
    }

    // Default to Distributor session mode for Super Admin and approved Distributors
    if (role === "super_admin" || role === "distributor") {
      localStorage.setItem(STORAGE_KEYS.SESSION_MODE, "distributor");
    } else {
      localStorage.setItem(STORAGE_KEYS.SESSION_MODE, "customer");
    }

    // Dispatch custom storage event for instant UI sync
    window.dispatchEvent(new Event("dcf_auth_change"));
  }

  return {
    email: normalizedEmail,
    name: userName,
    role,
    partnerStatus: status,
    avatarUrl,
    distributorId: distributorRecord?.id,
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

export const ADMIN_WHATSAPP_NUMBER = "919347965863"; // 9347965863
export const ADMIN_EMAIL_ADDRESS = "dreamcomfortfurniture.in@gmail.com";

export interface PartnerNotificationUrls {
  requestId: string;
  whatsappUrl: string;
  gmailUrl: string;
  mailtoUrl: string;
  waText: string;
}

export function generatePartnerNotificationUrls(params: {
  name: string;
  email: string;
  phone: string;
  requestId?: string;
  notes?: string;
}): PartnerNotificationUrls {
  const requestId = params.requestId || `REQ_${Date.now()}`;
  const timeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const siteUrl = getPublicSiteUrl();
  const waText = `Hello Admin,

A user has requested access to Dream Comfort Partner Portal:
👤 Name: ${params.name}
✉️ Email: ${params.email}
📞 Phone: ${params.phone}
⏰ Time: ${timeStr}
🔖 Request ID: ${requestId}
${params.notes ? `📝 Note: ${params.notes}\n` : ""}
Mandatory Admin Approval is required to unlock Partner Portal access.
Approve in Admin Dashboard: ${siteUrl}/admin`;

  const mailSubject = `[URGENT] Partner Portal Access Request - Approval Required (${params.name})`;
  const mailBody = `Hello Admin,

A user has requested Partner Portal Access at Dream Comfort Furniture India:

👤 Name: ${params.name}
✉️ Google Email: ${params.email}
📞 Phone Number: ${params.phone}
⏰ Timestamp: ${timeStr}
🔖 Request ID: ${requestId}
${params.notes ? `📝 Notes: ${params.notes}\n` : ""}
--------------------------------------------------
IMPORTANT WORKFLOW RULE:
The Partner Portal is strictly locked to this user until you approve them.

TO APPROVE THIS USER:
1. Open the Admin Portal: ${siteUrl}/admin
2. Go to "Distributor Management" and click "Approve Distributor" next to ${params.email}.

Customer Direct WhatsApp: https://wa.me/91${params.phone.replace(/\D/g, "")}`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(waText)}`;
  const mailtoUrl = `mailto:${ADMIN_EMAIL_ADDRESS}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL_ADDRESS}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return { requestId, whatsappUrl, gmailUrl, mailtoUrl, waText };
}

/**
 * Generate a pre-filled welcoming Gmail message for the authenticated Google user.
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

Your Google Account (${params.email}) has been successfully connected to our handcrafted solid wood luxury platform.

Exclusive Benefits Unlocked for You:
🎁 25% Private Member Welcome Discount
🪵 100% Genuine Seasoned Teakwood & Sheesham Craftsmanship
🚚 Priority Workshop-to-Doorstep Delivery & White-Glove Assembly
🛡️ Comprehensive Termite & Wood Workmanship Assurance

View your personalized offers and explore our artisan catalog anytime:
${siteUrl}/customer

Need custom dimensions, fabric selection, or live workshop video consultation?
📞 Workshop Concierge: +91 9347965863 / +91 9959427831
✉️ Master Admin Email: ${ADMIN_EMAIL_ADDRESS}

Warm regards,
Dream Comfort Furniture India
Handcrafted Solid Wood Luxury Living`;

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(params.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Request Partner / Distributor access for a Customer.
 */
export function submitPartnerAccessRequest(
  email: string,
  name: string,
  phone: string = "+91 99999 00000"
): void {
  if (typeof window === "undefined") return;
  const normalized = email.trim().toLowerCase();
  const currentList = getDistributorsRegistry();

  const existingIdx = currentList.findIndex(
    (d: any) => d.email && d.email.toLowerCase() === normalized
  );

  if (existingIdx >= 0) {
    currentList[existingIdx].status = "Pending";
    currentList[existingIdx].name = name;
    currentList[existingIdx].phone = phone;
  } else {
    const newDist = {
      id: `DC${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      email: normalized,
      phone,
      rank: "Associate",
      status: "Pending",
      bv: 0,
      pv: 0,
      joinedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      permissions: ["Pending Admin Verification"],
    };
    currentList.unshift(newDist);
  }

  localStorage.setItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(currentList));
  window.dispatchEvent(new Event("dcf_auth_change"));
}

/**
 * Admin action: Approve partner request.
 */
export function approvePartnerByAdmin(distributorIdOrEmail: string): void {
  if (typeof window === "undefined") return;
  const currentList = getDistributorsRegistry();
  const query = distributorIdOrEmail.toLowerCase();

  const updated = currentList.map((d: any) => {
    if (d.id?.toLowerCase() === query || d.email?.toLowerCase() === query) {
      return {
        ...d,
        status: "Active",
        permissions: ["Full Network Access", "Direct Selling Leader"],
      };
    }
    return d;
  });

  localStorage.setItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(updated));
  window.dispatchEvent(new Event("dcf_auth_change"));

  // Sync to server API so approval immediately takes effect across devices
  try {
    fetch("/api/admin/distributors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: query, id: query, status: "Active" }),
    });
  } catch {}
}

/**
 * Session Mutual Exclusion: Get active session view mode.
 */
export function getActiveSessionMode(): SessionViewMode {
  if (typeof window === "undefined") return "customer";
  const mode = localStorage.getItem(STORAGE_KEYS.SESSION_MODE);
  return mode === "distributor" ? "distributor" : "customer";
}

/**
 * Session Mutual Exclusion: Switch active session view mode.
 * When switching to "distributor", Customer Page locks.
 * When switching to "customer", Customer Page unlocks.
 */
export function setActiveSessionMode(mode: SessionViewMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SESSION_MODE, mode);
  window.dispatchEvent(new Event("dcf_session_mode_change"));
}
