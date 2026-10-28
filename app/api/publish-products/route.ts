import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/publish-products
// Commits the full products array directly to data/products.json on GitHub
// so the live Vercel deployment rebuilds with the latest catalog.
// Requires env vars:
//   GITHUB_TOKEN         – Personal Access Token (repo + contents write scope)
//   GITHUB_REPO_OWNER    – e.g. "dreamcomfortfurniturein-lab"
//   GITHUB_REPO_NAME     – e.g. "dreamcomfortfurnitureindia"
//   GITHUB_BRANCH        – default "main"
// ---------------------------------------------------------------------------

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "data/products.json";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    return null;
  }
  return { token, owner, repo, branch };
}

export async function POST(req: NextRequest) {
  // ── Auth guard – only accept requests from the admin UI ──────────────────
  const cfg = getConfig();
  if (!cfg) {
    return NextResponse.json(
      {
        success: false,
        error:
          "GitHub publishing is not configured. Add GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME to your environment variables.",
      },
      { status: 503 }
    );
  }

  let products: unknown[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.products)) {
      return NextResponse.json(
        { success: false, error: "Request body must be { products: [...] }" },
        { status: 400 }
      );
    }
    products = body.products;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const headers = {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "dreamcomfortfurnitureindia-admin",
  };

  // ── Step 1: Fetch current file SHA (required to update an existing file) ──
  let currentSha: string | undefined;
  try {
    const shaRes = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${FILE_PATH}?ref=${cfg.branch}`,
      { headers }
    );
    if (shaRes.ok) {
      const shaData = await shaRes.json();
      currentSha = shaData.sha as string;
    } else if (shaRes.status !== 404) {
      const errText = await shaRes.text();
      return NextResponse.json(
        { success: false, error: `GitHub SHA fetch failed: ${errText}` },
        { status: 502 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, error: `Network error fetching file SHA: ${String(e)}` },
      { status: 502 }
    );
  }

  // ── Step 2: Base64-encode the new products JSON ───────────────────────────
  const prettyJson = JSON.stringify(products, null, 2);
  const encoded = Buffer.from(prettyJson, "utf-8").toString("base64");

  // ── Step 3: Commit / update the file via GitHub Contents API ─────────────
  const commitBody: Record<string, unknown> = {
    message: `chore: publish product catalog update [skip ci]`,
    content: encoded,
    branch: cfg.branch,
  };
  if (currentSha) {
    commitBody.sha = currentSha; // required for updating an existing file
  }

  try {
    const commitRes = await fetch(
      `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(commitBody),
      }
    );

    if (!commitRes.ok) {
      const errText = await commitRes.text();
      return NextResponse.json(
        { success: false, error: `GitHub commit failed (${commitRes.status}): ${errText}` },
        { status: 502 }
      );
    }

    const commitData = await commitRes.json();
    const commitSha: string = commitData?.commit?.sha ?? "unknown";

    return NextResponse.json({
      success: true,
      message: "Products published to GitHub successfully! Vercel is rebuilding the live site.",
      commit: commitSha,
      productsCount: products.length,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: `Network error during commit: ${String(e)}` },
      { status: 502 }
    );
  }
}

