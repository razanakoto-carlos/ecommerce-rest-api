export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const TOKEN_KEY = "volt_token";

export const CATEGORY_LABELS = {
  headphone: "Headphones",
  watch: "Watches",
  "video-game": "Video Games",
  "mobile-phone": "Mobile Phones",
  laptop: "Laptops",
};

export function imageUrl(folder, filename) {
  if (!filename) return null;
  return `${API_URL}/upload/${folder}/${filename}`;
}
