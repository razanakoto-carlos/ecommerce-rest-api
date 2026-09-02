const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function stockStatus(stock) {
  if (stock <= 0) return { label: "Out of stock", tone: "danger" };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: "warn" };
  return { label: "In stock", tone: "ok" };
}

export function apiErrorMessage(error, fallback = "Something went wrong. Try again.") {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  return fallback;
}
