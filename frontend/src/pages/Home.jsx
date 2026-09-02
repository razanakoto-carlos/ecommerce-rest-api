import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { imageUrl, CATEGORY_LABELS } from "../lib/constants";
import ProductCard from "../components/ProductCard";
import ParallaxLayer from "../components/ParallaxLayer";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { apiErrorMessage } from "../lib/format";

const TRUST_ROWS = [
  { icon: Truck, label: "Free shipping", value: "Orders over $50" },
  { icon: ShieldCheck, label: "Secure checkout", value: "JWT-authenticated" },
  { icon: RotateCcw, label: "Easy returns", value: "7-day window" },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    Promise.all([getCategories(), getProducts({ page: 1, perPage: 8 })])
      .then(([cats, prods]) => {
        if (!active) return;
        setCategories(cats);
        setProducts(prods.products);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function handleQuickAdd(product) {
    if (!isAuthenticated) {
      toast.error("Log in to add items to your cart");
      navigate("/login");
      return;
    }
    add(product._id, 1)
      .then(() => toast.success(`${product.title} added to cart`))
      .catch((err) => toast.error(apiErrorMessage(err, "Could not add to cart")));
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
        <section className="relative overflow-hidden rounded-[2rem] bg-hero">
          <div className="relative grid gap-12 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
                New stock, restocked weekly
              </span>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance text-ink sm:text-5xl lg:text-6xl">
                Electronics,
                <br />
                powered up.
              </h1>
              <p className="mt-6 max-w-md text-base text-muted">
                Headphones, phones, laptops, watches, and everything with a plug. Sourced from independent sellers,
                shipped from the shelf to your door.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
                >
                  Shop the catalog
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link to="/register" className="text-sm font-medium text-muted transition hover:text-ink">
                  Create an account
                </Link>
              </div>

              <dl className="mt-12 grid grid-cols-1 gap-4 border-t border-line/70 pt-8 sm:grid-cols-3">
                {TRUST_ROWS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wide text-muted">{row.label}</dt>
                        <dd className="text-sm text-ink">{row.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-2xl bg-surface" />
                ))}
              {!loading &&
                categories.slice(0, 6).map((category, i) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category.name}`}
                    className={`group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      i === 0 ? "col-span-2 row-span-1 sm:col-span-2 sm:row-span-2 aspect-auto" : ""
                    }`}
                  >
                    <ParallaxLayer speed={0.06 + (i % 3) * 0.03} className="absolute inset-0">
                      <img
                        src={imageUrl("category", category.image)}
                        alt=""
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-110"
                      />
                    </ParallaxLayer>
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/5 to-transparent" />
                    <span className="relative font-display text-sm text-ink sm:text-base">
                      {CATEGORY_LABELS[category.name] || category.name}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-select-deep">Latest arrivals</p>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Fresh off the shelf</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm text-muted hover:text-ink sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24 text-accent">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
