import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted">
              Consumer electronics, sold straight from the people who stock them. Headphones, phones, laptops,
              watches, and everything in between.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-wide text-muted sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="text-faint">Shop</span>
              <Link to="/products" className="hover:text-ink">
                Catalog
              </Link>
              <Link to="/cart" className="hover:text-ink">
                Cart
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-faint">Account</span>
              <Link to="/login" className="hover:text-ink">
                Log in
              </Link>
              <Link to="/register" className="hover:text-ink">
                Register
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} VOLT Electronics</span>
          <span>Node · Express · MongoDB · React</span>
        </div>
      </div>
    </footer>
  );
}
