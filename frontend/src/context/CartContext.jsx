import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as cartApi from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (productId, quantity = 1) => {
      const { cart: updated } = await cartApi.addToCart(productId, quantity);
      setCart(updated);
      return updated;
    },
    []
  );

  const remove = useCallback(async (productId) => {
    const { cart: updated } = await cartApi.removeFromCart(productId);
    setCart(updated);
    return updated;
  }, []);

  const itemCount = cart?.totalProducts || 0;

  const value = useMemo(
    () => ({ cart, loading, itemCount, refresh, add, remove }),
    [cart, loading, itemCount, refresh, add, remove]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
