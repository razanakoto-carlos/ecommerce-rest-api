import client from "./client";

export function getCategories() {
  return client.get("/category").then((res) => res.data);
}

export function createCategory(formData) {
  return client
    .post("/category", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
}
