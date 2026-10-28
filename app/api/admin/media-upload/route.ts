import { NextRequest, NextResponse } from "next/server";
import {
  processAndRouteMedia,
  MandatoryCategory,
  MandatoryMaterial,
  LayoutOrientation,
  MANDATORY_CATEGORIES,
  MANDATORY_MATERIALS,
} from "@/lib/media-processor";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let searchQuery = "";
    let category = "" as MandatoryCategory;
    let material = "" as MandatoryMaterial;
    let orientation = "" as LayoutOrientation;
    let directUrl: string | undefined;
    let file: File | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      searchQuery = (formData.get("searchQuery") as string) || "";
      category = (formData.get("category") as MandatoryCategory) || "";
      material = (formData.get("material") as MandatoryMaterial) || "";
      orientation = (formData.get("orientation") as LayoutOrientation) || "";
      directUrl = (formData.get("directUrl") as string) || undefined;
      const formFile = formData.get("file");
      if (formFile && formFile instanceof File) {
        file = formFile;
      }
    } else {
      const json = await req.json();
      searchQuery = json.searchQuery || "";
      category = json.category || "";
      material = json.material || "";
      orientation = json.orientation || "";
      directUrl = json.directUrl || undefined;
    }

    // Validate inputs
    if (!searchQuery.trim()) {
      return NextResponse.json(
        { error: "Tier 1 Search Query is mandatory." },
        { status: 400 }
      );
    }
    if (!MANDATORY_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Tier 2 Category must be one of: ${MANDATORY_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!MANDATORY_MATERIALS.includes(material)) {
      return NextResponse.json(
        { error: `Tier 3 Material must be one of: ${MANDATORY_MATERIALS.join(", ")}` },
        { status: 400 }
      );
    }
    if (orientation !== "Vertical" && orientation !== "Horizontal") {
      return NextResponse.json(
        { error: "Layout Orientation must be 'Vertical' or 'Horizontal'." },
        { status: 400 }
      );
    }

    const confirmation = await processAndRouteMedia({
      searchQuery,
      category,
      material,
      orientation,
      file,
      directUrl,
      fileName: file?.name,
    });

    // SECURITY CHECK: Ensure zero internal folder paths or directory structures leak
    const sanitizedResponse = {
      success: true,
      message: confirmation.message,
      hostedUrl: confirmation.hostedUrl,
      mediaKind: confirmation.mediaKind,
      provider: confirmation.metadata.provider,
      metadata: {
        itemQuery: confirmation.metadata.itemQuery,
        category: confirmation.metadata.category,
        material: confirmation.metadata.material,
        orientation: confirmation.metadata.orientation,
      },
    };

    return NextResponse.json(sanitizedResponse);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Media processing failed." },
      { status: 500 }
    );
  }
}
