/**
 * Cloudinary Image Management (FINAL CLEAN VERSION)
 * Store ONLY public_id in Firebase
 */

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ecommerce-app-866ee";

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ======================
// CONFIG
// ======================
const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

// ======================
// UPLOAD IMAGE
// ======================
export const uploadImage = async (file) => {
  if (!file) throw new Error("No file selected");

  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, WebP, GIF allowed");
  }

  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    throw new Error("File too large (Max 5MB)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "ecommerce/products");

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // 🔥 DEBUG (REMOVE LATER)
  console.log("CLOUDINARY RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload failed");
  }

  // ✅ IMPORTANT: store ONLY public_id in Firebase
  return data.public_id;
};

// ======================
// IMAGE URL BUILDER
// ======================
export const getImageUrl = (publicId, transform) => {
  if (!publicId) return "/placeholder-image.jpg";

  // handle old full URL (safety fallback)
  if (typeof publicId === "string" && publicId.startsWith("http")) {
    return publicId;
  }

  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  const t = transform || "w_600,h_600,c_fill,f_auto,q_auto";

  return `${base}${t}/${publicId}`;
};

// ======================
// THUMBNAIL
// ======================
export const getThumbnail = (id) =>
  getImageUrl(id, "w_150,h_150,c_fill,f_auto,q_auto");

// ======================
// MEDIUM
// ======================
export const getMediumImage = (id) =>
  getImageUrl(id, "w_400,h_400,c_fill,f_auto,q_auto");

// ======================
// LARGE
// ======================
export const getLargeImage = (id) =>
  getImageUrl(id, "w_800,h_800,c_fill,f_auto,q_auto");

// ======================
// HERO
// ======================
export const getHeroImage = (id) =>
  getImageUrl(id, "w_1200,h_400,c_fill,f_auto,q_auto");