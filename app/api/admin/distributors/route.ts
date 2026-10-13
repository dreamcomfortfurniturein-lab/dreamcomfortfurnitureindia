import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialDistributorsData from "@/data/distributors.json";
import { getServiceSupabase, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DISTRIBUTORS_FILE = path.join(process.cwd(), "data", "distributors.json");

// In-memory cache for fast serverless execution
let serverDistributors: any[] = [...initialDistributorsData];

function readDistributorsFromFile(): any[] {
  try {
    if (fs.existsSync(DISTRIBUTORS_FILE)) {
      const content = fs.readFileSync(DISTRIBUTORS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read distributors.json from disk:", err);
  }
  return initialDistributorsData;
}

function writeDistributorsToFile(list: any[]): void {
  try {
    fs.writeFileSync(DISTRIBUTORS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write distributors.json to disk (serverless runtime):", err);
  }
}

/**
 * GET /api/admin/distributors
 * Returns full list of distributors, merging Supabase partner requests if available.
 */
export async function GET() {
  let list = readDistributorsFromFile();

  // Try to load any pending/approved partner requests from Supabase
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getServiceSupabase();
      const { data: requests } = await supabase
        .from("partner_access_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requests && requests.length > 0) {
        for (const req of requests) {
          if (!req.email) continue;
          const normalized = req.email.trim().toLowerCase();
          const existingIdx = list.findIndex(
            (d: any) => d.email && d.email.toLowerCase() === normalized
          );
          if (existingIdx === -1) {
            list.unshift({
              id: req.request_id || `DC${Math.floor(100000 + Math.random() * 900000)}`,
              name: req.name || normalized.split("@")[0],
              email: normalized,
              phone: req.phone || "+91 93479 65863",
              rank: "Associate",
              status: req.status === "approved" ? "Active" : "Pending",
              bv: 0,
              pv: 0,
              joinedDate: new Date(req.created_at || Date.now()).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              permissions: req.status === "approved"
                ? ["Full Network Access", "Direct Selling Leader"]
                : ["Pending Admin Verification"],
            });
          } else if (req.status === "approved" && list[existingIdx].status !== "Active") {
            list[existingIdx].status = "Active";
            list[existingIdx].permissions = ["Full Network Access", "Direct Selling Leader"];
          }
        }
      }
    } catch (err) {
      console.warn("Supabase query error in GET /api/admin/distributors:", err);
    }
  }

  // Ensure skylimits306@gmail.com is ALWAYS marked Active
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

  serverDistributors = list;
  return NextResponse.json({ success: true, distributors: list });
}

/**
 * POST /api/admin/distributors
 * Admin action: Approve or modify distributor by id or email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, status = "Active", name, phone } = body;

    const target = (email || id || "").trim().toLowerCase();
    if (!target) {
      return NextResponse.json({ error: "Missing distributor id or email." }, { status: 400 });
    }

    let list = readDistributorsFromFile();
    const idx = list.findIndex(
      (d: any) =>
        (d.email && d.email.toLowerCase() === target) ||
        (d.id && d.id.toLowerCase() === target)
    );

    if (idx >= 0) {
      list[idx].status = status;
      if (status === "Active") {
        list[idx].permissions = ["Full Network Access", "Direct Selling Leader", "Weekly Payouts"];
      }
    } else {
      // Add as new distributor
      list.unshift({
        id: id || `DC${Math.floor(100000 + Math.random() * 900000)}`,
        name: name || target.split("@")[0],
        email: email || (target.includes("@") ? target : undefined),
        phone: phone || "+91 93479 65863",
        rank: "Gold Leader",
        status,
        bv: 100000,
        pv: 100,
        joinedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        permissions: status === "Active"
          ? ["Full Network Access", "Direct Selling Leader", "Weekly Payouts"]
          : ["Pending Verification"],
      });
    }

    writeDistributorsToFile(list);
    serverDistributors = list;

    // Update in Supabase partner_access_requests if available
    if (isSupabaseServerConfigured()) {
      try {
        const supabase = getServiceSupabase();
        await supabase
          .from("partner_access_requests")
          .update({
            status: status === "Active" ? "approved" : "rejected",
            approved_at: new Date().toISOString(),
          })
          .ilike("email", target);
      } catch (err) {
        console.warn("Supabase update notice:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Distributor ${target} status updated to ${status}.`,
      distributors: list,
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/distributors:", err);
    return NextResponse.json({ error: "Failed to update distributor." }, { status: 500 });
  }
}
