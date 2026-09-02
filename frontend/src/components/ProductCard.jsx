import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import PriceTag from "./PriceTag";
import StockBadge from "./StockBadge";
import { imageUrl } from "../lib/constants";

export default function ProductCard({ product, onQuickAdd, adding }) {
  const image = imageUrl("products", product.images);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_40px_-20px_rgba(255,122,26,0.3)]">
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-surface-2">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-faint">NO IMAGE</div>
        )}
        <div className="absolute right-3 top-3">
          <PriceTag price={product.price} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 font-medium leading-snug text-ink transition hover:text-accent"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <StockBadge stock={product.stock} />
          {onQuickAdd && (
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              disabled={product.stock <= 0 || adding}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition hover:bg-accent hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
