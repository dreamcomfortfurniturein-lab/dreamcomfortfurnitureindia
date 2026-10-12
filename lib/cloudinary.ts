/**
 * Cloudinary & Postimages Media Integration Helper
 * Dream Comfort Furniture (dreamcomfortfurniture.in@gmail.com)
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: "image" | "video";
  created_at: string;
}

export interface VideoMeta {
  id: string;
  title: string;
  type: "showroom" | "product_demo" | "craftsmanship" | "testimonial";
  url: string;
  thumbnailUrl: string;
  sourceType: "cloudinary" | "youtube" | "direct_mp4";
  duration?: string;
  description?: string;
  createdAt: string;
}

// Default environment configurations with fallbacks
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "og57tmj8";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dcf_products";

/**
 * Upload an image or video directly to Cloudinary using unsigned upload preset
 */
export async function uploadMediaToCloudinary(
  file: File,
  resourceType: "image" | "video" = "image",
  folder: string = "products",
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const cloudName = CLOUDINARY_CLOUD_NAME;
  const uploadPreset = CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in environment variables.");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            secure_url: data.secure_url,
            public_id: data.public_id,
            format: data.format || file.type.split("/")[1] || "unknown",
            width: data.width || 0,
            height: data.height || 0,
            bytes: data.bytes || file.size,
            resource_type: resourceType,
            created_at: data.created_at || new Date().toISOString(),
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        let errorMsg = `Cloudinary Upload Error (${xhr.status})`;
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData.error?.message) {
            errorMsg = errData.error.message;
          }
        } catch {
          // ignore parse error
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload. Please check your connection."));
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (folder) {
      formData.append("folder", folder);
    }

    xhr.send(formData);
  });
}

/**
 * Generate an optimized Cloudinary delivery URL with automatic format and responsive sizing
 */
export function getOptimizedImageUrl(
  url: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string }
): string {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const { width = 1000, height, crop = "fill", quality = "auto" } = options || {};
  const transformations = [
    `f_auto`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    height ? `c_${crop}` : "",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${transformations}/`);
}

/**
 * Validate and normalize Postimages.org links
 * Handles both direct link (https://i.postimg.cc/...) and gallery page (https://postimg.cc/...)
 */
export function parsePostimagesUrl(rawUrl: string): {
  isValid: boolean;
  directUrl: string;
  isPostimages: boolean;
  message?: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: false, directUrl: "", isPostimages: false, message: "URL cannot be empty." };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // Check if it is a Postimages domain
    if (host.includes("postimg.cc") || host.includes("postimages.org")) {
      // Direct image URL pattern: https://i.postimg.cc/XXXXX/filename.jpg
      if (host.startsWith("i.postimg.cc")) {
        return { isValid: true, directUrl: trimmed, isPostimages: true };
      }

      // If user pasted the viewer page link: https://postimg.cc/ABCXYZ
      return {
        isValid: true,
        directUrl: trimmed,
        isPostimages: true,
        message:
          "Note: For optimal loading, ensure you copy the 'Direct link' (starting with i.postimg.cc) from Postimages.org.",
      };
    }

    // Generic valid URL
    const isImageExtension = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(parsed.pathname);
    return {
      isValid: true,
      directUrl: trimmed,
      isPostimages: false,
      message: isImageExtension
        ? undefined
        : "Valid URL. If this is an external image, please confirm direct image access is permitted.",
    };
  } catch {
    return { isValid: false, directUrl: "", isPostimages: false, message: "Invalid URL format." };
  }
}

/**
 * Extract YouTube ID and return embed URL and high-res thumbnail
 */
export function getYouTubeVideoDetails(url: string): {
  isYouTube: boolean;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
} {
  if (!url) {
    return { isYouTube: false, videoId: null, embedUrl: null, thumbnailUrl: null };
  }

  // Regular expressions for youtube.com and youtu.be
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(ytRegex);

  if (match && match[1]) {
    const videoId = match[1];
    return {
      isYouTube: true,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  return { isYouTube: false, videoId: null, embedUrl: null, thumbnailUrl: null };
}

/**
 * Format bytes to readable string (KB / MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
