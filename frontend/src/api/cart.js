import client from "./client";

export function getCart() {
  return client.get("/cart").then((res) => res.data);
}

export function addToCart(productId, quantity = 1) {
  return client.post(`/cart/${productId}`, { quantity }).then((res) => res.data);
}

export function removeFromCart(productId) {
  return client.patch(`/cart/remove/${productId}`).then((res) => res.data);
}
