import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import { TOKEN_KEY } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyToken = useCallback(
    async (newToken) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setLoading(true);
      await loadUser(newToken);
    },
    [loadUser]
  );

  const login = useCallback(
    async (email, password) => {
      const { token: newToken } = await authApi.login(email, password);
      await applyToken(newToken);
    },
    [applyToken]
  );

  const register = useCallback(
    async (data) => {
      const { token: newToken } = await authApi.register(data);
      await applyToken(newToken);
    },
    [applyToken]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      applyToken,
    }),
    [token, user, loading, login, register, logout, applyToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
