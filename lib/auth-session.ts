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
};

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
 * Get current distributors registry (localStorage with fallback to initialDistributorsData).
 */
export function getDistributorsRegistry(): any[] {
  if (typeof window === "undefined") return initialDistributorsData;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISTRIBUTORS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(initialDistributorsData));
    return initialDistributorsData;
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
 */
export function getCurrentAuthUser(): DCFAuthUser | null {
  if (typeof window === "undefined") return null;

  const email = localStorage.getItem(STORAGE_KEYS.EMAIL);
  if (!email) return null;

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
    localStorage.setItem(STORAGE_KEYS.EMAIL, normalizedEmail);
    localStorage.setItem(STORAGE_KEYS.NAME, userName);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    if (avatarUrl) {
      localStorage.setItem(STORAGE_KEYS.AVATAR, avatarUrl);
    }

    // Default to Customer session mode upon fresh sign in, unless Super Admin
    if (role === "super_admin") {
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
  localStorage.setItem(STORAGE_KEYS.SESSION_MODE, "customer");
  window.dispatchEvent(new Event("dcf_auth_change"));
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
