import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    navigate(search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : "/products");
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search_products..."
            className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 font-mono text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          <Link to="/products" className="text-sm text-muted transition hover:text-ink">
            Catalog
          </Link>
          {user?.role === "seller" && (
            <Link to="/sell" className="text-sm text-muted transition hover:text-ink">
              Sell
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/categories" className="text-sm text-muted transition hover:text-ink">
              Admin
            </Link>
          )}
        </nav>

        <Link
          to="/cart"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent"
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-accent-ink">
              {itemCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm text-ink transition hover:border-accent"
            >
              <User className="h-4 w-4" />
              {user?.name?.split(" ")[0]}
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="border-b border-line px-4 py-3">
                  <p className="truncate text-sm text-ink">{user?.email}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-accent">{user?.role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted transition hover:bg-surface-2 hover:text-ink"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-110 md:block"
          >
            Log in
          </Link>
        )}

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-bg px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search_products..."
              className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 font-mono text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">
              Catalog
            </Link>
            {user?.role === "seller" && (
              <Link to="/sell" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">
                Sell
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin/categories" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="text-left text-danger">
                Log out ({user?.email})
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-accent">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
