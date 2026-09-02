import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getProduct, deleteProduct } from "../api/products";
import PriceTag from "../components/PriceTag";
import StockBadge from "../components/StockBadge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { imageUrl } from "../lib/constants";
import { apiErrorMessage } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { add } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getProduct(productId)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setQuantity(1);
        setActiveImage(0);
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-accent">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Product not found"
          description="This listing may have been removed or sold out permanently."
          action={
            <Link to="/products" className="text-sm font-semibold text-select-deep hover:underline">
              Back to catalog
            </Link>
          }
        />
      </div>
    );
  }

  const canDelete = user && (user.role === "admin" || user._id === product.seller?._id);

  function handleAdd() {
    if (!isAuthenticated) {
      toast.error("Log in to add items to your cart");
      navigate("/login");
      return;
    }
    setAdding(true);
    add(product._id, quantity)
      .then(() => toast.success(`${quantity} × ${product.title} added to cart`))
      .catch((err) => toast.error(apiErrorMessage(err, "Could not add to cart")))
      .finally(() => setAdding(false));
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    setDeleting(true);
    deleteProduct(product._id)
      .then(() => {
        toast.success("Product deleted");
        navigate("/products");
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Could not delete product")))
      .finally(() => setDeleting(false));
  }

  const images = product.images?.length ? product.images : [null];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
            {images[activeImage] ? (
              <img
                src={imageUrl("products", images[activeImage])}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-xs text-faint">NO IMAGE</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img || i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i ? "border-select-deep" : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imageUrl("products", img)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{product.title}</h1>
            <PriceTag price={product.price} size="lg" />
          </div>

          <div className="mt-4">
            <StockBadge stock={product.stock} />
          </div>

          {product.seller && (
            <p className="mt-4 text-sm text-muted">
              Sold by <span className="text-ink">{product.seller.name}</span>
            </p>
          )}

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-ink transition hover:text-accent"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-mono text-sm text-ink">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-ink transition hover:text-accent"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock <= 0 || adding}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              {adding ? <Spinner className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {product.stock <= 0 ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-danger/40 px-4 py-2 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50"
            >
              {deleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              Delete listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
