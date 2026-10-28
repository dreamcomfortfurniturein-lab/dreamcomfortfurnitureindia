import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialProducts from "@/data/products.json";

export const dynamic = "force-dynamic";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

// In-memory cache for serverless environments where filesystem may be read-only
let memoryProducts: any[] = initialProducts;

function readProducts(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read products from file, fallback to memory:", err);
  }
  return memoryProducts;
}

function writeProducts(list: any[]): boolean {
  memoryProducts = list;
  try {
    const dir = path.dirname(PRODUCTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
    return true;
  } catch (err) {
    console.warn("Filesystem write skipped or serverless read-only:", err);
    return false;
  }
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(
    { success: true, count: products.length, products },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json(
        { success: false, error: "Product name is required." },
        { status: 400 }
      );
    }

    const currentList = readProducts();
    const slug =
      body.slug?.trim() ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newProduct = {
      ...body,
      slug,
      price: Number(body.price) || 0,
      mrp: Number(body.mrp) || Number(body.price) || 0,
      stock: Number(body.stock) || 1,
      images:
        Array.isArray(body.images) && body.images.length > 0
          ? body.images
          : [
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
            ],
    };

    const existingIndex = currentList.findIndex((p: any) => p.slug === slug);
    let updatedList: any[];

    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = { ...currentList[existingIndex], ...newProduct };
    } else {
      updatedList = [newProduct, ...currentList];
    }

    writeProducts(updatedList);

    return NextResponse.json({
      success: true,
      message: `Product "${newProduct.name}" saved and published live!`,
      product: newProduct,
      products: updatedList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required." },
        { status: 400 }
      );
    }

    const currentList = readProducts();
    const updatedList = currentList.filter((p: any) => p.slug !== slug);
    writeProducts(updatedList);

    return NextResponse.json({
      success: true,
      message: `Product "${slug}" deleted successfully.`,
      products: updatedList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

