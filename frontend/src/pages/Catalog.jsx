import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import ProductCard from "../components/ProductCard";
import CategoryStrip from "../components/CategoryStrip";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiErrorMessage } from "../lib/format";

const PER_PAGE = 12;

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1", 10);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getProducts({ page, perPage: PER_PAGE, category, search })
      .then((data) => {
        if (!active) return;
        setProducts(data.products);
        setTotal(data.totalProduct);
      })
      .catch(() => active && setError("Couldn't load products. Is the backend running?"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, category, search]);

  function updateParams(next) {
    const merged = { category, search, page: String(page), ...next };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([, v]) => v !== null && v !== undefined && v !== "")
    );
    setParams(cleaned);
  }

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

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">Catalog</p>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">
          {search ? `Results for "${search}"` : "Everything in stock"}
        </h1>
      </div>

      <div className="mt-6">
        <CategoryStrip
          categories={categories}
          active={category}
          onSelect={(name) => updateParams({ category: name, page: "1" })}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-24 text-accent">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <EmptyState icon={PackageSearch} title="Couldn't reach the store" description={error} />
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try a different search term or clear the category filter."
        />
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: String(p) })} />
        </>
      )}
    </div>
  );
}
