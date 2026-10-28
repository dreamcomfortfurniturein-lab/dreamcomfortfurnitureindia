"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import initialProductsData from "../../data/products.json";
import initialDistributorsData from "../../data/distributors.json";
import initialOffersData from "../../data/offers.json";
import initialAssistantsData from "../../data/assistants.json";
import initialCustomersData from "../../data/customers.json";
import SystemCoreSecurityBanner from "./components/SystemCoreSecurityBanner";
import DistributorManagementSection, { Distributor } from "./components/DistributorManagementSection";
import CustomerOffersSection, { CustomerOffer, CustomerRecord } from "./components/CustomerOffersSection";
import AssistantDelegationSection, { Assistant } from "./components/AssistantDelegationSection";
import {
  uploadMediaToCloudinary,
  parsePostimagesUrl,
  getYouTubeVideoDetails,
  formatBytes,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  VideoMeta,
} from "../../lib/cloudinary";
import { getCurrentAuthUser, isSuperAdminEmail } from "@/lib/auth-session";

export interface Product {
  slug: string;
  name: string;
  category: string;
  material: string;
  dimensions?: string;
  price: number;
  mrp: number;
  memberPrice?: number;
  bv?: number;
  pv?: number;
  stock: number;
  featured?: boolean;
  badge?: string;
  description: string;
  images: string[];
}

export interface UploadedMediaItem {
  id: string;
  url: string;
  name?: string;
  format?: string;
  size?: number;
  source: "cloudinary" | "postimages" | "external";
  uploadedAt: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const DEFAULT_CATEGORIES = [
  "All",
  "Living Room",
  "Bedroom Sets",
  "Handcrafted Solid Teak",
  "Dining Suites",
  "Ergonomic Office",
  "Royal Recliners",
  "Outdoor & Patio",
];

const DEFAULT_MATERIALS = [
  "Sheesham",
  "Teak",
  "Leatherette",
  "Acrylic",
  "Fabric",
] as const;

type DefaultMaterial = (typeof DEFAULT_MATERIALS)[number];

const INITIAL_VIDEOS: VideoMeta[] = [
  {
    id: "vid-1",
    title: "Handcrafted Teakwood Seasoning & Carving Process",
    type: "craftsmanship",
    url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    thumbnailUrl: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg",
    sourceType: "youtube",
    duration: "03:45",
    description: "Factory walkthrough showcasing 45-day solar kiln timber seasoning and hand-carved floral inlays.",
    createdAt: "2026-03-15",
  },
  {
    id: "vid-2",
    title: "Luxury Flagship Showroom Virtual Tour",
    type: "showroom",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    sourceType: "direct_mp4",
    duration: "01:20",
    description: "Walkthrough of our premier display galleries and bespoke teak living collections.",
    createdAt: "2026-03-20",
  },
  {
    id: "vid-3",
    title: "Luxury Villa Teak Suite Installation",
    type: "showroom",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    sourceType: "direct_mp4",
    duration: "02:10",
    description: "Architectural overview on the white-glove installation of our Maharaja Teak suite.",
    createdAt: "2026-04-01",
  },
];

export default function AdminDashboardPage() {
  // Navigation tabs (3-tier primary governance + existing asset tools)
  const [activeTab, setActiveTab] = useState<
    "distributors" | "offers" | "assistants" | "catalog" | "media" | "videos" | "mobile" | "settings"
  >("distributors");
  const [pendingMedia, setPendingMedia] = useState<any[]>([]);
  const [mobileVerifyCodeInput, setMobileVerifyCodeInput] = useState<{ [id: string]: string }>({});

  // 3-Tier Security Governance State
  const [currentAuthRole, setCurrentAuthRole] = useState("master_admin");
  const [currentAuthEmail, setCurrentAuthEmail] = useState("dreamcomfortfurniture.in@gmail.com");

  // Primary Management Portals State (Pre-seeded for SSR & Client Hydration)
  const [distributors, setDistributors] = useState<Distributor[]>(initialDistributorsData as Distributor[]);
  const [customerOffers, setCustomerOffers] = useState<CustomerOffer[]>(initialOffersData as CustomerOffer[]);
  const [assistants, setAssistants] = useState<Assistant[]>(initialAssistantsData as Assistant[]);
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomersData as CustomerRecord[]);

  // Products state (seeded from data/products.json with localStorage persistence)
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAdminMaterial, setSelectedAdminMaterial] = useState("All");

  // Product modal (Create / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);
  const [selectedMaterialType, setSelectedMaterialType] = useState<DefaultMaterial>("Sheesham");
  const [productForm, setProductForm] = useState<Product>({
    slug: "",
    name: "",
    category: "Living Room",
    material: "Sheesham",
    dimensions: "",
    price: 0,
    mrp: 0,
    memberPrice: 0,
    bv: 0,
    pv: 0,
    stock: 1,
    featured: false,
    badge: "",
    description: "",
    images: [],
  });
  const [tempProductImageUrl, setTempProductImageUrl] = useState("");

  // Media state
  const [mediaGallery, setMediaGallery] = useState<UploadedMediaItem[]>([]);
  const [postimagesInputUrl, setPostimagesInputUrl] = useState("");
  const [postimagesPreview, setPostimagesPreview] = useState<{ url: string; note?: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Video state
  const [videos, setVideos] = useState<VideoMeta[]>(INITIAL_VIDEOS);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    type: "showroom" as VideoMeta["type"],
    url: "",
    sourceType: "youtube" as VideoMeta["sourceType"],
    thumbnailUrl: "",
    duration: "",
    description: "",
  });
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [activePreviewVideo, setActivePreviewVideo] = useState<VideoMeta | null>(null);

  // UI state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const productPhotoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingProductPhoto, setIsUploadingProductPhoto] = useState(false);
  const [uploadProductPhotoProgress, setUploadProductPhotoProgress] = useState<number | null>(null);

  // Publish to Live Site state
  const [isPublishing, setIsPublishing] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    try {
      const activeUser = getCurrentAuthUser();
      if (activeUser?.email && isSuperAdminEmail(activeUser.email)) {
        setCurrentAuthEmail(activeUser.email);
        setCurrentAuthRole("master_admin");
      }

      // Load products — localStorage is the primary source of truth for the admin
      // IMPORTANT: Do NOT overwrite from API after loading because it would erase products
      // the admin just created (race condition). The admin WRITES to the API; not reads from it.
      const storedProducts = localStorage.getItem("dcf_admin_products");
      if (storedProducts) {
        try {
          const parsed = JSON.parse(storedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          } else {
            throw new Error("empty");
          }
        } catch {
          const seeded: Product[] = (initialProductsData as any[]).map((p) => ({
            ...p,
            dimensions: p.dimensions || "84\"W x 38\"D x 36\"H",
          }));
          setProducts(seeded);
          localStorage.setItem("dcf_admin_products", JSON.stringify(seeded));
        }
      } else {
        const seeded: Product[] = (initialProductsData as any[]).map((p) => ({
          ...p,
          dimensions: p.dimensions || "84\"W x 38\"D x 36\"H",
        }));
        setProducts(seeded);
        localStorage.setItem("dcf_admin_products", JSON.stringify(seeded));
      }

      const storedMedia = localStorage.getItem("dcf_admin_media");
      if (storedMedia) {
        setMediaGallery(JSON.parse(storedMedia));
      } else {
        // Seed initial media from existing product images
        const initialMedia: UploadedMediaItem[] = [];
        (initialProductsData as any[]).forEach((p) => {
          (p.images || []).forEach((img: string, idx: number) => {
            initialMedia.push({
              id: `${p.slug}-img-${idx}`,
              url: img,
              name: `${p.name} Photo ${idx + 1}`,
              source: img.includes("postimg") ? "postimages" : img.includes("cloudinary") ? "cloudinary" : "external",
              uploadedAt: new Date().toISOString(),
            });
          });
        });
        setMediaGallery(initialMedia.slice(0, 10));
      }

      const storedVideos = localStorage.getItem("dcf_admin_videos");
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos));
      }

      // 1. Initialize Distributors (Tier 2 Registry with live merge & server sync)
      const storedDist = localStorage.getItem("dcf_admin_distributors");
      let initialList: Distributor[] = storedDist ? JSON.parse(storedDist) : [...(initialDistributorsData as Distributor[])];
      if (!Array.isArray(initialList)) initialList = [...(initialDistributorsData as Distributor[])];

      // Merge initialDistributorsData to guarantee skylimits306@gmail.com and active entries
      for (const initD of initialDistributorsData as Distributor[]) {
        const idx = initialList.findIndex((d) => d.email && d.email.toLowerCase() === initD.email.toLowerCase());
        if (idx === -1) {
          initialList.unshift(initD);
        } else if (initD.status === "Active" && initialList[idx].status !== "Active") {
          initialList[idx] = { ...initialList[idx], ...initD, status: "Active" };
        }
      }
      setDistributors(initialList);
      localStorage.setItem("dcf_admin_distributors", JSON.stringify(initialList));

      // Fetch live distributors & pending requests from server
      fetch("/api/admin/distributors")
        .then((res) => res.json())
        .then((data) => {
          if (data?.distributors && Array.isArray(data.distributors)) {
            setDistributors(data.distributors);
            localStorage.setItem("dcf_admin_distributors", JSON.stringify(data.distributors));
          }
        })
        .catch(() => {});

      // 2. Initialize Customer Offers (Tier 1 Integration)
      const storedOffers = localStorage.getItem("dcf_customer_offers");
      if (storedOffers) {
        setCustomerOffers(JSON.parse(storedOffers));
      } else {
        setCustomerOffers(initialOffersData as CustomerOffer[]);
        localStorage.setItem("dcf_customer_offers", JSON.stringify(initialOffersData));
      }

      // 3. Initialize Sub-Assistants (Max 5 Limit Enforced)
      const storedAssistants = localStorage.getItem("dcf_admin_assistants");
      if (storedAssistants) {
        setAssistants(JSON.parse(storedAssistants));
      } else {
        setAssistants(initialAssistantsData as Assistant[]);
        localStorage.setItem("dcf_admin_assistants", JSON.stringify(initialAssistantsData));
      }

      // 4. Initialize Customers Database
      const storedCustomers = localStorage.getItem("dcf_admin_customers");
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        setCustomers(initialCustomersData as CustomerRecord[]);
        localStorage.setItem("dcf_admin_customers", JSON.stringify(initialCustomersData));
      }

      // 5. Check Auth Role
      const authRole = localStorage.getItem("dcf_auth_role");
      if (authRole) setCurrentAuthRole(authRole);
      const authEmail = localStorage.getItem("dcf_auth_email");
      if (authEmail) setCurrentAuthEmail(authEmail);

      loadPendingMedia();
    } catch (err) {
      console.error("Initialization error:", err);
    }
  }, []);

  // Update handlers for 3-Tier Governance
  function handleUpdateDistributors(updated: Distributor[]) {
    setDistributors(updated);
    try {
      localStorage.setItem("dcf_admin_distributors", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  function handleUpdateOffers(updated: CustomerOffer[]) {
    setCustomerOffers(updated);
    try {
      localStorage.setItem("dcf_customer_offers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  function handleUpdateAssistants(updated: Assistant[]) {
    setAssistants(updated);
    try {
      localStorage.setItem("dcf_admin_assistants", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  function handleUpdateCustomers(updated: CustomerRecord[]) {
    setCustomers(updated);
    try {
      localStorage.setItem("dcf_admin_customers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // Save to localStorage when state updates
  function persistProducts(updated: Product[]) {
    setProducts(updated);
    try {
      localStorage.setItem("dcf_admin_products", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  function persistMedia(updated: UploadedMediaItem[]) {
    setMediaGallery(updated);
    try {
      localStorage.setItem("dcf_admin_media", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  function persistVideos(updated: VideoMeta[]) {
    setVideos(updated);
    try {
      localStorage.setItem("dcf_admin_videos", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // Toast notification helper
  function showToast(message: string, type: "success" | "error" | "info" = "success") {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  // Copy to clipboard helper
  function handleCopy(text: string, keyId: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      showToast("Link copied to clipboard!", "success");
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  async function loadPendingMedia() {
    try {
      const res = await fetch("/api/admin/media-submit");
      const data = await res.json();
      if (data.pending) setPendingMedia(data.pending);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleApprovePending(id: string, code: string) {
    try {
      const res = await fetch("/api/admin/media-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");
      showToast(data.message || "Item approved and published live!", "success");
      loadPendingMedia();
    } catch (err: any) {
      showToast(err.message || "Approval failed", "error");
    }
  }

  // -------------------------------------------------------------
  // CLOUDINARY DIRECT IMAGE UPLOAD
  // -------------------------------------------------------------
  async function handleCloudinaryDirectUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await uploadMediaToCloudinary(
          file,
          "image",
          "products",
          (percent) => setUploadProgress(percent)
        );

        const newItem: UploadedMediaItem = {
          id: result.public_id || Date.now().toString(),
          url: result.secure_url,
          name: file.name,
          format: result.format,
          size: result.bytes,
          source: "cloudinary",
          uploadedAt: new Date().toISOString(),
        };

        const updated = [newItem, ...mediaGallery];
        persistMedia(updated);
        showToast(`Uploaded "${file.name}" successfully to Cloudinary!`, "success");
      } catch (err: any) {
        showToast(err.message || "Failed to upload to Cloudinary.", "error");
      }
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Cloudinary Upload Widget script integration
  function openCloudinaryWidget() {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          folder: "dreamcomfort_catalog",
          sources: ["local", "url", "camera", "dropbox"],
          multiple: true,
          maxFiles: 10,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "avif"],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const newItem: UploadedMediaItem = {
              id: result.info.public_id,
              url: result.info.secure_url,
              name: result.info.original_filename || "Cloudinary Upload",
              format: result.info.format,
              size: result.info.bytes,
              source: "cloudinary",
              uploadedAt: new Date().toISOString(),
            };
            const updated = [newItem, ...mediaGallery];
            persistMedia(updated);
            showToast("Cloudinary widget upload complete!", "success");
          }
        }
      );
      widget.open();
    } else {
      showToast("Cloudinary Widget is loading, please try the direct file picker above.", "info");
    }
  }

  // -------------------------------------------------------------
  // POSTIMAGES.ORG INTEGRATION
  // -------------------------------------------------------------
  function handlePostimagesPreview() {
    const parsed = parsePostimagesUrl(postimagesInputUrl);
    if (!parsed.isValid) {
      showToast(parsed.message || "Please provide a valid image URL.", "error");
      setPostimagesPreview(null);
      return;
    }

    setPostimagesPreview({
      url: parsed.directUrl,
      note: parsed.message,
    });
  }

  function handleAddPostimagesUrl() {
    if (!postimagesPreview?.url) return;

    const newItem: UploadedMediaItem = {
      id: "postimg-" + Date.now(),
      url: postimagesPreview.url,
      name: "Postimages Asset " + new Date().toLocaleDateString(),
      source: "postimages",
      uploadedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...mediaGallery];
    persistMedia(updated);
    setPostimagesInputUrl("");
    setPostimagesPreview(null);
    showToast("Postimages asset added to media studio!", "success");
  }

  function handleDeleteMedia(id: string) {
    const updated = mediaGallery.filter((item) => item.id !== id);
    persistMedia(updated);
    showToast("Media item removed from studio.", "info");
  }

  // -------------------------------------------------------------
  // CATALOG CRUD OPERATIONS
  // -------------------------------------------------------------
  function detectMaterial(matStr: string): DefaultMaterial {
    const lower = (matStr || "").toLowerCase();
    if (lower.includes("fabric") || lower.includes("velvet") || lower.includes("upholstery") || lower.includes("linen")) return "Fabric";
    if (lower.includes("sheesham") || lower.includes("rosewood")) return "Sheesham";
    if (lower.includes("teak") || lower.includes("sagwan")) return "Teak";
    if (lower.includes("leatherette") || lower.includes("leather")) return "Leatherette";
    if (lower.includes("acrylic")) return "Acrylic";
    return "Sheesham";
  }

  function handleMaterialChange(newMat: DefaultMaterial) {
    setSelectedMaterialType(newMat);
    const current = (productForm.material || "").trim();
    const isStandard =
      !current ||
      DEFAULT_MATERIALS.some((m) => m.toLowerCase() === current.toLowerCase());
    if (isStandard) {
      setProductForm((prev) => ({ ...prev, material: newMat }));
    } else {
      const oldDetected = detectMaterial(current);
      if (current.toLowerCase().includes(oldDetected.toLowerCase())) {
        const regex = new RegExp(oldDetected, "gi");
        setProductForm((prev) => ({ ...prev, material: current.replace(regex, newMat) }));
      } else {
        setProductForm((prev) => ({ ...prev, material: `${newMat} - ${current}` }));
      }
    }
  }

  function openAddProductModal() {
    setEditingProductSlug(null);
    setSelectedMaterialType("Sheesham");
    setProductForm({
      slug: "",
      name: "",
      category: "Living Room",
      material: "Sheesham",
      dimensions: "84\"W x 38\"D x 36\"H",
      price: 45000,
      mrp: 60000,
      memberPrice: 38000,
      bv: 19000,
      pv: 190,
      stock: 5,
      featured: false,
      badge: "New Arrival",
      description: "Exquisite hand-carved piece seasoned to 8-10% equilibrium moisture content with lifetime termite warranty.",
      images: [],
    });
    setTempProductImageUrl("");
    setIsProductModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProductSlug(product.slug);
    setSelectedMaterialType(detectMaterial(product.material));
    setProductForm({ ...product });
    setTempProductImageUrl("");
    setIsProductModalOpen(true);
  }

  function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!productForm.name.trim()) {
      showToast("Please enter a product title.", "error");
      return;
    }

    const generatedSlug =
      productForm.slug.trim() ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const finalMaterial = productForm.material.trim() || selectedMaterialType;

    const finalProduct: Product = {
      ...productForm,
      material: finalMaterial,
      slug: generatedSlug,
      images: productForm.images.length > 0
        ? productForm.images
        : [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
          ],
    };

    let updatedList: Product[];
    if (editingProductSlug) {
      updatedList = products.map((p) => (p.slug === editingProductSlug ? finalProduct : p));
      showToast(`Updated "${finalProduct.name}" successfully!`, "success");
    } else {
      // Check duplicate slug
      if (products.some((p) => p.slug === generatedSlug)) {
        showToast("A product with this slug already exists. Please choose a unique title.", "error");
        return;
      }
      updatedList = [finalProduct, ...products];
      showToast(`Added "${finalProduct.name}" to the catalog!`, "success");
    }

    persistProducts(updatedList);
    setIsProductModalOpen(false);

    // Persist permanently to live server catalog API so it appears across customer website & actual domain
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          showToast(`✓ Published "${finalProduct.name}" live to domain!`, "success");
        }
      })
      .catch((err) => {
        console.warn("Failed to sync product with live API:", err);
      });
  }

  async function handleDeleteProduct(slug: string) {
    const updated = products.filter((p) => p.slug !== slug);
    persistProducts(updated);
    setDeleteConfirmSlug(null);
    showToast("Product deleted from catalog.", "info");

    try {
      await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
    } catch {}
  }

  // ── Publish to Live Site ──────────────────────────────────────────────────
  async function handlePublishToLiveSite() {
    if (isPublishing) return;
    setIsPublishing(true);
    showToast("Publishing catalog to live site…", "info");
    try {
      const res = await fetch("/api/publish-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast(
          `✅ Published successfully! Live site is rebuilding… (${data.productsCount} products)`,
          "success"
        );
      } else {
        showToast(`❌ Publish failed: ${data?.error || "Unknown error"}`, "error");
      }
    } catch (err) {
      showToast(`❌ Network error: ${String(err)}`, "error");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleProductPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingProductPhoto(true);
    setUploadProductPhotoProgress(10);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await uploadMediaToCloudinary(
          file,
          "image",
          "products",
          (percent) => {
            const overall = Math.round(((i + percent / 100) / files.length) * 100);
            setUploadProductPhotoProgress(overall);
          }
        );
        uploadedUrls.push(result.secure_url);
      } catch (err: any) {
        showToast(`Failed to upload ${file.name}: ${err.message}`, "error");
      }
    }

    if (uploadedUrls.length > 0) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      showToast(
        `✓ Uploaded & attached ${uploadedUrls.length} photo(s) directly from phone!`,
        "success"
      );
    }

    setIsUploadingProductPhoto(false);
    setUploadProductPhotoProgress(null);
    if (productPhotoInputRef.current) {
      productPhotoInputRef.current.value = "";
    }
  }

  function addImageToProductForm(url: string) {
    if (!url.trim()) return;
    if (productForm.images.includes(url)) {
      showToast("This image is already attached to this product.", "info");
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, url.trim()],
    }));
    setTempProductImageUrl("");
    showToast("Image attached to product draft.", "success");
  }

  function removeImageFromProductForm(index: number) {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  // -------------------------------------------------------------
  // VIDEO SHOWCASE OPERATIONS
  // -------------------------------------------------------------
  async function handleCloudinaryVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVideoUploadProgress(15);
      showToast("Uploading video to Cloudinary...", "info");

      const result = await uploadMediaToCloudinary(
        file,
        "video",
        "showroom_videos",
        (percent) => setVideoUploadProgress(percent)
      );

      const generatedThumb = result.secure_url.replace(/\.[^/.]+$/, ".jpg");

      setVideoForm((prev) => ({
        ...prev,
        url: result.secure_url,
        thumbnailUrl: generatedThumb,
        sourceType: "cloudinary",
      }));

      setVideoUploadProgress(null);
      showToast("Video uploaded! Finalize title and details below.", "success");
    } catch (err: any) {
      setVideoUploadProgress(null);
      showToast(err.message || "Failed to upload video to Cloudinary.", "error");
    }
  }

  function handleSaveVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.url.trim()) {
      showToast("Please provide both a video title and URL.", "error");
      return;
    }

    let finalThumbnail = videoForm.thumbnailUrl;
    let finalSourceType = videoForm.sourceType;

    // Detect YouTube
    const yt = getYouTubeVideoDetails(videoForm.url);
    if (yt.isYouTube) {
      finalSourceType = "youtube";
      if (!finalThumbnail && yt.thumbnailUrl) {
        finalThumbnail = yt.thumbnailUrl;
      }
    }

    if (!finalThumbnail) {
      finalThumbnail = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80";
    }

    const newVideo: VideoMeta = {
      id: "vid-" + Date.now(),
      title: videoForm.title,
      type: videoForm.type,
      url: videoForm.url,
      thumbnailUrl: finalThumbnail,
      sourceType: finalSourceType,
      duration: videoForm.duration || "02:00",
      description: videoForm.description,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newVideo, ...videos];
    persistVideos(updated);
    setIsVideoModalOpen(false);
    setVideoForm({
      title: "",
      type: "showroom",
      url: "",
      sourceType: "youtube",
      thumbnailUrl: "",
      duration: "",
      description: "",
    });
    showToast("Showroom video added successfully!", "success");
  }

  function handleDeleteVideo(id: string) {
    const updated = videos.filter((v) => v.id !== id);
    persistVideos(updated);
    showToast("Video removed from showcase.", "info");
  }

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const material = (p.material || "").toLowerCase();
    const description = (p.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesMaterial =
      selectedAdminMaterial === "All" ||
      material.includes(selectedAdminMaterial.toLowerCase());
    const matchesSearch =
      query === "" ||
      name.includes(query) ||
      material.includes(query) ||
      description.includes(query);
    return matchesCategory && matchesMaterial && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-navy-900 text-sand-50 selection:bg-gold selection:text-navy-900">
      {/* Cloudinary Widget Script */}
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm flex items-center justify-between gap-3 animate-slide-up transition-all ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
                : "bg-navy-800/90 border-gold/40 text-sand-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && (
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === "info" && (
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-xl border-b border-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teak flex items-center justify-center text-navy-900 font-bold shadow-md shadow-gold/20">
                  <span className="font-serif text-lg tracking-wider">DC</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-xl sm:text-2xl text-sand-50 tracking-wide">
                      Dream Comfort Furniture
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/20 text-gold-accent border border-gold/40 uppercase tracking-widest">
                      Admin Portal
                    </span>
                  </div>
                  <p className="text-xs text-sand-300/70 flex items-center gap-2">
                    <span>Contact:</span>
                    <a
                      href="mailto:dreamcomfortfurniture.in@gmail.com"
                      className="text-gold hover:underline font-mono text-[11px]"
                    >
                      dreamcomfortfurniture.in@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="md:hidden flex items-center gap-2">
                <Link
                  href="/"
                  className="text-xs px-3 py-1.5 rounded-lg border border-gold/30 text-gold hover:bg-gold/10"
                >
                  View Store
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-4 bg-navy-800/80 px-3 py-1.5 rounded-xl border border-gold/10 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cloudinary: <strong className="text-sand-100">{CLOUDINARY_CLOUD_NAME}</strong>
                </span>
                <span className="text-sand-300/40">•</span>
                <span className="text-sand-300/80">
                  Products: <strong className="text-gold">{products.length}</strong>
                </span>
              </div>

              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-sand-200 hover:text-gold transition-colors px-3 py-2 rounded-lg bg-navy-800 border border-gold/20"
              >
                <span>Live Catalog</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs (Primary 3-Tier Governance + Asset Tools) */}
          <nav className="flex space-x-1 sm:space-x-2 border-t border-gold/10 pt-2 overflow-x-auto no-scrollbar">
            {/* Primary Page 1: Distributor Management */}
            <button
              onClick={() => setActiveTab("distributors")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "distributors"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <span>👥</span>
              <span>Trade & Client Inquiries</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-gold/20 text-gold font-bold">
                {distributors.length}
              </span>
            </button>

            {/* Primary Page 2: Customer & Offers */}
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "offers"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <span>🎁</span>
              <span>Customer & Offers</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-navy-700 text-sand-200">
                {customerOffers.length}
              </span>
            </button>

            {/* Delegation: Assistant Delegation (Max 5 Limit) */}
            <button
              onClick={() => setActiveTab("assistants")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "assistants"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <span>🛡️</span>
              <span>Assistants Delegation</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  assistants.length >= 5
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-navy-700 text-sand-200"
                }`}
              >
                {assistants.length}/5
              </span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "catalog"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Catalog Management</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-navy-700 text-sand-200">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "media"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Image Studio & Hosting</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-gold/20 text-gold">
                Cloudinary + Postimages
              </span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "videos"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Videos & Showroom Clips</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-navy-700 text-sand-200">
                {videos.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("mobile");
                loadPendingMedia();
              }}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "mobile"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Phone Uploads & Approvals</span>
              {pendingMedia.filter((m) => m.status === "pending").length > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-navy-900 font-bold animate-pulse">
                  {pendingMedia.filter((m) => m.status === "pending").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === "settings"
                  ? "bg-navy-800/90 text-gold border-gold font-semibold shadow-inner"
                  : "text-sand-300 hover:text-sand-100 hover:bg-navy-800/40 border-transparent"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Setup & Cloudinary Guide</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Core Security Banner (3-Tier Architecture Governance) */}
        <SystemCoreSecurityBanner
          currentRole={currentAuthRole}
          adminEmail={currentAuthEmail}
          assistantCount={assistants.length}
          maxAssistants={5}
          onMasterOverride={() =>
            showToast(
              "Master Admin Override: All system workflows synchronized and aligned with supreme master authority.",
              "success"
            )
          }
        />

        {/* ========================================================================= */}
        {/* PRIMARY MANAGEMENT PAGE 1: DISTRIBUTOR MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "distributors" && (
          <DistributorManagementSection
            distributors={distributors}
            onUpdateDistributors={handleUpdateDistributors}
            onShowToast={showToast}
          />
        )}

        {/* ========================================================================= */}
        {/* PRIMARY MANAGEMENT PAGE 2: CUSTOMER & OFFERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "offers" && (
          <CustomerOffersSection
            offers={customerOffers}
            customers={customers}
            onUpdateOffers={handleUpdateOffers}
            onUpdateCustomers={handleUpdateCustomers}
            onShowToast={showToast}
          />
        )}

        {/* ========================================================================= */}
        {/* ASSISTANT DELEGATION: ADMIN SUB-USERS (MAX 5 STRICT LIMIT) */}
        {/* ========================================================================= */}
        {activeTab === "assistants" && (
          <AssistantDelegationSection
            assistants={assistants}
            onUpdateAssistants={handleUpdateAssistants}
            onShowToast={showToast}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CATALOG MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "catalog" && (
          <section className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-gold/20 shadow-xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                  Furniture Catalog Management
                </h2>
                <p className="text-xs sm:text-sm text-sand-300/80">
                  Manage inventory, pricing, teakwood specs, dimensions, and Cloudinary/Postimages product photos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={openAddProductModal}
                  className="gold-gradient-bg text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-gold/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Product</span>
                </button>

                {/* Publish to Live Site */}
                <button
                  onClick={handlePublishToLiveSite}
                  disabled={isPublishing}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg border ${
                    isPublishing
                      ? "bg-navy-700 border-green-500/30 text-green-300/60 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500 border-green-500 text-white shadow-green-900/40"
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Publishing…</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                      </svg>
                      <span>Publish to Live Site</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <svg
                  className="w-4 h-4 text-sand-300/50 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products by title, material, or wood type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-sand-300/70 whitespace-nowrap">Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-navy-800 border border-gold/20 text-sand-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-sand-300/70 whitespace-nowrap">Material:</label>
                  <select
                    value={selectedAdminMaterial}
                    onChange={(e) => setSelectedAdminMaterial(e.target.value)}
                    className="bg-navy-800 border border-gold/20 text-sand-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="All">All Materials</option>
                    {DEFAULT_MATERIALS.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid / Cards */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-navy-800/40 rounded-2xl border border-gold/10">
                <p className="text-sand-300 text-base">No furniture items match your search or filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedAdminMaterial("All");
                  }}
                  className="mt-3 text-gold text-xs underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.slug}
                    className="glass-card rounded-2xl border border-gold/20 overflow-hidden flex flex-col group hover:border-gold/50 transition-all duration-300 shadow-xl"
                  >
                    {/* Image Preview & Badges */}
                    <div className="relative h-48 bg-navy-950 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          prod.images && prod.images.length > 0
                            ? prod.images[0]
                            : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy-900/90 text-gold border border-gold/40 backdrop-blur-sm">
                          {prod.category}
                        </span>
                        {prod.badge && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold text-navy-900">
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-navy-900/90 border border-sand-300/20 text-emerald-400">
                          Stock: {prod.stock}
                        </span>
                      </div>

                      {/* Photo Gallery Count */}
                      <div className="absolute bottom-3 left-3 text-[11px] text-sand-300 flex items-center gap-1.5 bg-navy-900/80 px-2 py-0.5 rounded backdrop-blur-md">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{prod.images?.length || 0} media assets</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-sand-50 line-clamp-1 group-hover:text-gold transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-sand-300/70 mt-1 line-clamp-2">
                          {prod.description}
                        </p>

                        <div className="mt-3 space-y-1.5 text-xs text-sand-300/80 border-t border-gold/10 pt-3">
                          <div className="flex justify-between">
                            <span className="text-sand-300/60">Material:</span>
                            <span className="font-medium text-sand-200 text-right">{prod.material}</span>
                          </div>
                          {prod.dimensions && (
                            <div className="flex justify-between">
                              <span className="text-sand-300/60">Dimensions:</span>
                              <span className="font-medium text-sand-200">{prod.dimensions}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="border-t border-gold/10 pt-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gold">
                              ₹{prod.price?.toLocaleString("en-IN")}
                            </span>
                            {prod.mrp > prod.price && (
                              <span className="text-xs text-sand-300/50 line-through">
                                ₹{prod.mrp?.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          {prod.memberPrice && (
                            <span className="text-[10px] text-emerald-400 block">
                              Member: ₹{prod.memberPrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-2 rounded-lg bg-navy-800 border border-gold/20 text-gold hover:bg-gold hover:text-navy-900 transition-all"
                            title="Edit Product"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmSlug(prod.slug)}
                            className="p-2 rounded-lg bg-navy-800 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete Product"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: IMAGE STUDIO & HOSTING (Cloudinary + Postimages) */}
        {/* ========================================================================= */}
        {activeTab === "media" && (
          <section className="space-y-8">
            <div className="glass-card p-6 rounded-2xl border border-gold/20 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                    Image Hosting Studio (Postimages & Cloudinary)
                  </h2>
                  <p className="text-xs sm:text-sm text-sand-300/80">
                    Upload high-res furniture imagery directly to Cloudinary or paste direct links from Postimages.org.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openCloudinaryWidget}
                    className="px-4 py-2.5 rounded-xl bg-navy-800 border border-gold/40 text-gold text-xs sm:text-sm font-medium hover:bg-gold/10 transition-all flex items-center gap-2"
                  >
                    <span>Cloudinary Widget</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dual Upload Options Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gold/10">
                {/* Option 1: Direct Cloudinary File Upload */}
                <div className="bg-navy-800/80 p-5 rounded-xl border border-gold/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                          1
                        </span>
                        <h3 className="font-semibold text-sm text-sand-100">
                          Direct Cloudinary API Upload
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-sand-300 border border-gold/20">
                        Preset: {CLOUDINARY_UPLOAD_PRESET}
                      </span>
                    </div>
                    <p className="text-xs text-sand-300/70 mb-4">
                      Drag and drop high-resolution furniture photos. Automatically compressed with WebP/AVIF auto-format and optimized for web delivery.
                    </p>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-navy-900/50 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleCloudinaryDirectUpload}
                        className="hidden"
                      />
                      <svg
                        className="w-8 h-8 text-gold/70 group-hover:text-gold mx-auto mb-2 transition-transform group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-sand-200 block">
                        {isUploading ? "Uploading photos to Cloudinary..." : "Click or drag photos to upload"}
                      </span>
                      <span className="text-[11px] text-sand-300/50 mt-1 block">
                        JPG, PNG, WebP up to 25MB each
                      </span>
                    </div>

                    {uploadProgress !== null && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-sand-300 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div
                            className="h-full gold-gradient-bg transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Option 2: Postimages.org External URL Input */}
                <div className="bg-navy-800/80 p-5 rounded-xl border border-gold/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                          2
                        </span>
                        <h3 className="font-semibold text-sm text-sand-100">
                          Postimages.org Quick Embed
                        </h3>
                      </div>
                      <a
                        href="https://postimages.org"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-gold hover:underline flex items-center gap-1"
                      >
                        Open Postimages ↗
                      </a>
                    </div>
                    <p className="text-xs text-sand-300/70 mb-4">
                      Upload your image to Postimages.org, copy the <strong>Direct link</strong> (e.g.{" "}
                      <code className="text-gold/90 font-mono">https://i.postimg.cc/...</code>), and paste below.
                    </p>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste Postimages Direct Link (https://i.postimg.cc/...)"
                          value={postimagesInputUrl}
                          onChange={(e) => setPostimagesInputUrl(e.target.value)}
                          className="flex-1 bg-navy-900 border border-gold/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-sand-100 placeholder-sand-300/40 focus:outline-none focus:border-gold"
                        />
                        <button
                          type="button"
                          onClick={handlePostimagesPreview}
                          className="bg-navy-700 hover:bg-navy-600 text-sand-100 px-3 py-2 rounded-xl text-xs font-medium border border-gold/20"
                        >
                          Verify Link
                        </button>
                      </div>

                      {postimagesPreview && (
                        <div className="p-3 bg-navy-900/90 rounded-xl border border-teal-500/30 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={postimagesPreview.url}
                            alt="Postimages preview"
                            className="w-14 h-14 object-cover rounded-lg border border-gold/20"
                          />
                          <div className="flex-1 text-xs">
                            <span className="text-teal-400 font-semibold block">Valid Image Detected</span>
                            {postimagesPreview.note && (
                              <p className="text-[11px] text-amber-300/90 mt-0.5">{postimagesPreview.note}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddPostimagesUrl}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Add to Studio
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Media Thumbnail Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg text-sand-50 flex items-center gap-2">
                  <span>Live Media Thumbnail Gallery</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                    {mediaGallery.length} Items
                  </span>
                </h3>
              </div>

              {mediaGallery.length === 0 ? (
                <div className="text-center py-12 bg-navy-800/40 rounded-2xl border border-gold/10">
                  <p className="text-sand-300 text-sm">No media uploaded yet. Use the upload forms above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaGallery.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-xl border border-gold/20 overflow-hidden flex flex-col group hover:border-gold/60 transition-all shadow-md relative"
                    >
                      <div className="relative aspect-square bg-navy-950 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.name || "Media"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-2 left-2 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded backdrop-blur-md ${
                            item.source === "cloudinary"
                              ? "bg-amber-600/90 text-white"
                              : item.source === "postimages"
                              ? "bg-teal-600/90 text-white"
                              : "bg-navy-800/90 text-sand-200"
                          }`}
                        >
                          {item.source}
                        </span>

                        {item.size && (
                          <span className="absolute bottom-2 left-2 text-[9px] bg-black/70 px-1.5 py-0.5 rounded text-sand-300">
                            {formatBytes(item.size)}
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2 bg-navy-850">
                        <p className="text-[11px] text-sand-200 truncate font-mono" title={item.url}>
                          {item.name || item.url.split("/").pop()}
                        </p>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(item.url, item.id)}
                            className="flex-1 py-1 px-2 rounded bg-navy-800 hover:bg-gold hover:text-navy-900 border border-gold/20 text-gold text-[10px] font-medium transition-colors text-center"
                          >
                            {copiedKey === item.id ? "Copied ✓" : "Copy URL"}
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="p-1 rounded bg-navy-800 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-400 text-[10px] transition-colors"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VIDEOS & SHOWROOM CLIPS */}
        {/* ========================================================================= */}
        {activeTab === "videos" && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-gold/20 shadow-xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                  Videos & Showroom Clips Showcase
                </h2>
                <p className="text-xs sm:text-sm text-sand-300/80">
                  Feature workshop wood-seasoning videos, showroom walk-throughs, and verified client testimonials.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="gold-gradient-bg text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-gold/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Showroom Video</span>
                </button>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="glass-card rounded-2xl border border-gold/20 overflow-hidden flex flex-col group hover:border-gold/50 transition-all shadow-xl"
                >
                  {/* Thumbnail with Play Overlay */}
                  <div className="relative aspect-video bg-navy-950 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => setActivePreviewVideo(vid)}
                        className="w-12 h-12 rounded-full gold-gradient-bg text-navy-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform pl-0.5"
                        title="Play in Modal"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>

                    {/* Duration badge */}
                    {vid.duration && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-sand-100 backdrop-blur-sm">
                        {vid.duration}
                      </span>
                    )}

                    {/* Source tag */}
                    <span className="absolute top-2 left-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-navy-900/90 text-gold border border-gold/30">
                      {vid.sourceType}
                    </span>
                  </div>

                  {/* Video Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                          {vid.type.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-base text-sand-50 line-clamp-1">
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="text-xs text-sand-300/70 mt-1 line-clamp-2">
                          {vid.description}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gold/10 pt-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopy(vid.url, vid.id)}
                        className="text-xs text-gold hover:text-gold-light flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{copiedKey === vid.id ? "Copied ✓" : "Copy URL"}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePreviewVideo(vid)}
                          className="px-3 py-1.5 rounded-lg bg-navy-800 border border-gold/20 text-sand-100 text-xs hover:border-gold"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg bg-navy-800 border border-rose-500/20 text-rose-400 text-xs hover:bg-rose-500 hover:text-white"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SETUP & CLOUDINARY / POSTIMAGES GUIDE */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <section className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gold/20 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                  Integration & Environment Configuration
                </h2>
                <p className="text-xs sm:text-sm text-sand-300/80">
                  Follow these step-by-step instructions to configure Cloudinary and Postimages hosting for Dream Comfort Furniture.
                </p>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-navy-850 border border-gold/20">
                  <span className="text-xs text-sand-300/60 block">Cloud Name</span>
                  <span className="text-sm font-mono font-bold text-gold">{CLOUDINARY_CLOUD_NAME}</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-850 border border-gold/20">
                  <span className="text-xs text-sand-300/60 block">Upload Preset</span>
                  <span className="text-sm font-mono font-bold text-gold">{CLOUDINARY_UPLOAD_PRESET}</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-850 border border-gold/20">
                  <span className="text-xs text-sand-300/60 block">Admin Email</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">dreamcomfortfurniture.in@gmail.com</span>
                </div>
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-6 border-t border-gold/10 pt-6">
                <div>
                  <h3 className="font-semibold text-base text-gold mb-2">
                    Step 1: Setting up Cloudinary (.env.local)
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-300/80 leading-relaxed">
                    In your project root, add the following variables into your <code className="bg-navy-900 px-2 py-0.5 rounded text-gold">.env.local</code> file:
                  </p>
                  <pre className="mt-3 p-4 bg-navy-950 border border-gold/20 rounded-xl text-xs font-mono text-sand-200 overflow-x-auto">
{`# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=og57tmj8
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dcf_products

# Optional Server-Side Keys (For Signed API Deletions / Video Streaming)
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-gold mb-2">
                    Step 2: Creating an Unsigned Upload Preset in Cloudinary
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-sand-300/80">
                    <li>Log into your Cloudinary Console (<a href="https://cloudinary.com/console" target="_blank" rel="noreferrer" className="text-gold underline">cloudinary.com/console</a>).</li>
                    <li>Go to <strong>Settings</strong> (gear icon) → <strong>Upload</strong> tab.</li>
                    <li>Scroll down to <strong>Upload presets</strong> and click <strong>Add upload preset</strong>.</li>
                    <li>Set <strong>Signing Mode</strong> to <span className="text-emerald-400 font-semibold">Unsigned</span>.</li>
                    <li>Set the Preset Name to <span className="text-gold font-mono">dcf_products</span> (or matching your .env.local).</li>
                    <li>Under <em>Folder</em>, enter <span className="text-sand-100 font-mono">products</span>.</li>
                    <li>Save the preset. Direct uploads will now succeed instantly without backend auth!</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-gold mb-2">
                    Step 3: Using Postimages.org (No Account Required)
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-sand-300/80">
                    <li>Go to <a href="https://postimages.org" target="_blank" rel="noreferrer" className="text-gold underline">postimages.org</a>.</li>
                    <li>Select &quot;Do not resize my image&quot; and &quot;No expiration&quot;.</li>
                    <li>Upload your furniture photograph.</li>
                    <li>Copy the <strong>Direct link</strong> (format: <code className="text-gold font-mono">https://i.postimg.cc/xxx/image.jpg</code>).</li>
                    <li>Paste it into the <em>Postimages.org Quick Embed</em> section or inside the Product Editor to instantly link it!</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PHONE UPLOADS & GMAIL APPROVALS */}
        {/* ========================================================================= */}
        {activeTab === "mobile" && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-gold/20 shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📱</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-50">
                    Phone Uploads & Gmail Approvals
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-sand-300/80">
                  Manage videos and posters uploaded directly from smartphones with 6-digit code verification sent to{" "}
                  <strong className="text-gold font-mono">dreamcomfortfurniture.in@gmail.com</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/upload"
                  target="_blank"
                  className="gold-gradient-bg text-navy-900 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-md shadow-gold/20"
                >
                  <span>Launch Mobile Upload Portal (/upload)</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Dual Dimension Summary Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-navy-850 p-5 rounded-2xl border border-gold/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🖥️</span>
                    <h3 className="font-bold text-sm text-sand-50">Landscape Slot (16:9)</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-gold border border-gold/30">
                    Desktop & Widescreen
                  </span>
                </div>
                <p className="text-xs text-sand-300/70">
                  Showcase format displayed on computer screens, tablets, and widescreen TVs.
                </p>
              </div>

              <div className="bg-navy-850 p-5 rounded-2xl border border-gold/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <h3 className="font-bold text-sm text-sand-50">Vertical Slot (9:16)</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-amber-300 border border-gold/30">
                    Mobile & Reels
                  </span>
                </div>
                <p className="text-xs text-sand-300/70">
                  Portrait Reel format optimized for smartphone screens and mobile visitors.
                </p>
              </div>
            </div>

            {/* Pending Approvals List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg text-sand-50 flex items-center gap-2">
                  <span>Pending Submissions</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                    {pendingMedia.length} Total
                  </span>
                </h3>

                <button
                  onClick={loadPendingMedia}
                  className="text-xs text-gold hover:underline flex items-center gap-1"
                >
                  <span>↻ Refresh</span>
                </button>
              </div>

              {pendingMedia.length === 0 ? (
                <div className="text-center py-12 bg-navy-800/40 rounded-2xl border border-gold/10 space-y-3">
                  <span className="text-3xl block">✓</span>
                  <p className="text-sand-300 text-sm">No pending mobile submissions.</p>
                  <Link
                    href="/upload"
                    className="text-gold text-xs underline font-medium"
                  >
                    Test uploading a photo or video from phone →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMedia.map((item: any) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl border border-gold/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-gold/50 transition-all shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-black shrink-0 relative border border-gold/20">
                          {item.type === "video" ? (
                            <video
                              src={item.mediaUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.mediaUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1.5 py-0.5 rounded text-sand-200">
                            {item.type}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                item.orientation === "vertical"
                                  ? "bg-purple-900/40 border-purple-500/40 text-purple-300"
                                  : "bg-blue-900/40 border-blue-500/40 text-blue-300"
                              }`}
                            >
                              {item.orientation === "vertical" ? "📱 Vertical (9:16)" : "🖥️ Landscape (16:9)"}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                item.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-base text-sand-50">
                            {item.title}
                          </h4>
                          <p className="text-xs text-sand-300/70 max-w-lg">
                            {item.subtitle}
                          </p>

                          <div className="text-[11px] text-sand-300/50 flex flex-wrap gap-3 pt-1">
                            <span>From: <strong>{item.uploaderName}</strong> ({item.uploaderPhone})</span>
                            <span>•</span>
                            <span>Code: <strong className="font-mono text-gold">{item.approvalCode}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2.5 shrink-0">
                        {item.status === "pending" ? (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="6-digit code"
                              value={mobileVerifyCodeInput[item.id] || ""}
                              onChange={(e) =>
                                setMobileVerifyCodeInput({
                                  ...mobileVerifyCodeInput,
                                  [item.id]: e.target.value,
                                cloth: item.id,
                                })
                              }
                              className="w-28 text-center bg-navy-900 border border-gold/30 rounded-xl px-2.5 py-2 text-xs font-mono text-sand-100 focus:outline-none focus:border-gold"
                            />
                            <button
                              onClick={() => {
                                const codeToUse =
                                  mobileVerifyCodeInput[item.id] || item.approvalCode;
                                handleApprovePending(item.id, codeToUse);
                              }}
                              className="gold-gradient-bg text-navy-900 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 shadow-md transition-all whitespace-nowrap"
                            >
                              Approve & Publish Live
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <span>✓</span> Published to Front Page
                          </span>
                        )}

                        <button
                          onClick={() => handleCopy(item.mediaUrl, item.id)}
                          className="text-[11px] text-gold hover:underline"
                        >
                          Copy Media Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-900 border border-gold/30 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-sand-50">
                  {editingProductSlug ? "Edit Furniture Product" : "Add New Furniture Product"}
                </h3>
                <p className="text-xs text-sand-300/70">
                  Fill in product details, dimensions, wood specifications, and attach photos.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Royal Sheesham Maharaja 7-Seater Sofa Suite"
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  >
                    {DEFAULT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Material *
                  </label>
                  <select
                    value={selectedMaterialType}
                    onChange={(e) => handleMaterialChange(e.target.value as DefaultMaterial)}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  >
                    {DEFAULT_MATERIALS.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    MRP / List Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Wood / Material Specifications (Details)
                  </label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    placeholder="e.g. 100% Solid Indian Timber, Polish & Upholstery Details"
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Dimensions (W x D x H)
                  </label>
                  <input
                    type="text"
                    value={productForm.dimensions || ""}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="e.g. 84W x 38D x 36H (Inches)"
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed craftsmanship narrative, warranty details, cushioning, and finish..."
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl p-3 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Product Images Selection */}
              <div className="border border-gold/20 rounded-xl p-4 bg-navy-850 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-sand-200">
                    Product Photos (Camera, Phone Gallery or Cloudinary)
                  </label>
                  <span className="text-[11px] text-gold/80 font-medium">
                    {productForm.images.length} photo(s) attached
                  </span>
                </div>

                {/* Hidden Phone File Input */}
                <input
                  ref={productPhotoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductPhotoUpload}
                  className="hidden"
                />

                {/* 1. Direct Phone / Mobile Upload Button */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => productPhotoInputRef.current?.click()}
                    disabled={isUploadingProductPhoto}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl gold-gradient-bg text-navy-900 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>📷</span>
                    <span>
                      {isUploadingProductPhoto
                        ? `Uploading from Phone (${uploadProductPhotoProgress}%)...`
                        : "Upload Photos from Mobile (Camera / Gallery)"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={openCloudinaryWidget}
                    className="px-4 py-3 rounded-xl bg-navy-800 border border-gold/30 hover:border-gold text-sand-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>☁️</span>
                    <span>Cloudinary Studio</span>
                  </button>
                </div>

                {/* 2. Manual URL Paste */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste Cloudinary/Postimages photo link (https://...)"
                    value={tempProductImageUrl}
                    onChange={(e) => setTempProductImageUrl(e.target.value)}
                    className="flex-1 bg-navy-900 border border-gold/20 rounded-xl px-3 py-2 text-xs text-sand-100 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => addImageToProductForm(tempProductImageUrl)}
                    className="bg-navy-800 hover:bg-gold hover:text-navy-900 border border-gold/30 text-gold font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Attach Link
                  </button>
                </div>

                {/* 3. Quick-attach from Media Gallery if available */}
                {mediaGallery.length > 0 && (
                  <div className="pt-2 border-t border-gold/10">
                    <span className="text-[11px] text-sand-300/70 block mb-2">
                      Quick Attach from Studio Uploads (tap to add):
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {mediaGallery.slice(0, 8).map((media) => {
                        const isAttached = productForm.images.includes(media.url);
                        return (
                          <div
                            key={media.id}
                            onClick={() => !isAttached && addImageToProductForm(media.url)}
                            className={`relative w-12 h-12 rounded-lg overflow-hidden border cursor-pointer shrink-0 transition-all ${
                              isAttached
                                ? "border-emerald-500 opacity-50 cursor-not-allowed"
                                : "border-gold/30 hover:border-gold hover:scale-105"
                            }`}
                            title={isAttached ? "Already attached" : "Click to attach"}
                          >
                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                            {isAttached && (
                              <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                                ✓
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Attached Thumbnails Preview */}
                {productForm.images.length > 0 && (
                  <div className="pt-2 border-t border-gold/15">
                    <span className="text-[11px] text-sand-300/80 block mb-2 font-medium">
                      Attached Product Photos ({productForm.images.length}):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gold/40 shadow-md bg-navy-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageFromProductForm(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-900/90 hover:bg-rose-700 text-white text-[11px] flex items-center justify-center transition-colors"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-navy-950/80 text-[9px] text-gold font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-sand-300/20 text-sand-300 hover:text-sand-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient-bg text-navy-900 font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-95 shadow-md shadow-gold/20"
                >
                  {editingProductSlug ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD SHOWROOM VIDEO */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-900 border border-gold/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-sand-50">
                  Add Showroom & Testimonial Video
                </h3>
                <p className="text-xs text-sand-300/70">
                  Supports Cloudinary direct video uploads, YouTube links, or MP4 streams.
                </p>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-sand-300 hover:text-sand-100 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Master Woodworkers Hand-Carving Floral Teak Headboard"
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Video Category
                  </label>
                  <select
                    value={videoForm.type}
                    onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value as any })}
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  >
                    <option value="showroom">Showroom Virtual Tour</option>
                    <option value="craftsmanship">Factory & Craftsmanship</option>
                    <option value="product_demo">Product Walkthrough</option>
                    <option value="testimonial">Customer Testimonial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sand-200 mb-1">
                    Duration Tag (e.g. 02:45)
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="02:30"
                    className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Video URL (YouTube, Cloudinary, or Direct MP4) *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    const yt = getYouTubeVideoDetails(val);
                    setVideoForm((prev) => ({
                      ...prev,
                      url: val,
                      sourceType: yt.isYouTube ? "youtube" : "direct_mp4",
                      thumbnailUrl: yt.thumbnailUrl || prev.thumbnailUrl,
                    }));
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://res.cloudinary.com/..."
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Direct video file upload option */}
              <div className="p-3 bg-navy-850 rounded-xl border border-gold/15">
                <span className="text-[11px] text-sand-300 block mb-2">
                  Or upload a video directly via Cloudinary:
                </span>
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleCloudinaryVideoUpload}
                  className="text-xs text-sand-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-navy-900 cursor-pointer"
                />
                {videoUploadProgress !== null && (
                  <div className="mt-2 text-xs text-gold">
                    Uploading video: {videoUploadProgress}%
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Custom Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={videoForm.thumbnailUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                  placeholder="Leave blank for auto-generated thumbnail"
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl px-3.5 py-2.5 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sand-200 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Brief details about the showroom clip or customer..."
                  className="w-full bg-navy-800 border border-gold/20 rounded-xl p-3 text-sm text-sand-100 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-sand-300/20 text-sand-300 hover:text-sand-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient-bg text-navy-900 font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-95 shadow-md shadow-gold/20"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IN-DASHBOARD VIDEO PREVIEW PLAYER (PLAY / PAUSE) */}
      {/* ========================================================================= */}
      {activePreviewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-lg">
          <div className="bg-navy-900 border border-gold/40 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-gold/15">
              <div>
                <h3 className="font-display font-bold text-sand-50 text-lg">
                  {activePreviewVideo.title}
                </h3>
                <span className="text-xs text-gold capitalize">
                  {activePreviewVideo.type.replace("_", " ")} Showcase
                </span>
              </div>
              <button
                onClick={() => setActivePreviewVideo(null)}
                className="text-sand-300 hover:text-sand-100 text-xl px-2"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {activePreviewVideo.sourceType === "youtube" ? (
                <iframe
                  src={getYouTubeVideoDetails(activePreviewVideo.url).embedUrl || activePreviewVideo.url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activePreviewVideo.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 bg-navy-850 flex items-center justify-between text-xs text-sand-300">
              <span className="truncate max-w-md font-mono">{activePreviewVideo.url}</span>
              <button
                onClick={() => handleCopy(activePreviewVideo.url, "modal-vid")}
                className="text-gold hover:underline"
              >
                {copiedKey === "modal-vid" ? "Copied ✓" : "Copy Direct URL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-sand-50">
              Delete Product?
            </h4>
            <p className="text-xs text-sand-300/80">
              Are you sure you want to remove this item from your catalog? This action will update your inventory.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-4 py-2 rounded-xl border border-sand-300/20 text-sand-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmSlug)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
