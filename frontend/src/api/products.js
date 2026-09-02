import client from "./client";

export function getProducts({ page = 1, perPage = 12, category, search } = {}) {
  return client
    .get("/product", { params: { page, perPage, category: category || undefined, search: search || undefined } })
    .then((res) => res.data);
}

export function getProduct(productId) {
  return client.get(`/product/${productId}`).then((res) => res.data);
}

export function createProduct(formData) {
  return client
    .post("/product", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
}

export function deleteProduct(productId) {
  return client.delete(`/product/${productId}`).then((res) => res.data);
}
