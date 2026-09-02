import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { imageUrl } from "../lib/constants";
import { formatPrice, apiErrorMessage } from "../lib/format";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

export default function Cart() {
  const { cart, loading, add, remove } = useCart();
  const { user } = useAuth();
  const [busyId, setBusyId] = useState(null);

  function handleAddMore(item) {
    setBusyId(item.productId);
    add(item.productId, 1)
      .catch((err) => toast.error(apiErrorMessage(err, "Couldn't add another one — check stock")))
      .finally(() => setBusyId(null));
  }

  function handleRemove(item) {
    setBusyId(item.productId);
    remove(item.productId)
      .then(() => toast.success(`${item.title} removed from cart`))
      .catch((err) => toast.error(apiErrorMessage(err, "Couldn't remove item")))
      .finally(() => setBusyId(null));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-accent">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const items = cart?.products || [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add something with a plug and it'll show up here."
          action={
            <Link
              to="/products"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Browse the catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-select-deep">Cart</p>
      <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Your basket</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-surface">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4 sm:p-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                {item.image ? (
                  <img
                    src={imageUrl("products", item.image)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="mt-1 font-mono text-xs text-muted">{formatPrice(item.price)} each</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink">
                    Qty {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddMore(item)}
                    disabled={busyId === item.productId}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-ink transition hover:bg-accent hover:text-accent-ink disabled:opacity-40"
                    aria-label={`Add one more ${item.title}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="font-mono text-sm text-ink">{formatPrice(item.price * item.quantity)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={busyId === item.productId}
                  className="flex items-center gap-1 text-xs text-danger transition hover:underline disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-lg text-ink">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-muted">
              <dt>Items</dt>
              <dd className="font-mono text-ink">{cart.totalProducts}</dd>
            </div>
            <div className="flex items-center justify-between text-muted">
              <dt>Subtotal</dt>
              <dd className="font-mono text-ink">{formatPrice(cart.totalCartPrice)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-ink">
              <dt className="font-medium">Total</dt>
              <dd className="font-mono text-lg font-semibold text-select-deep">{formatPrice(cart.totalCartPrice)}</dd>
            </div>
          </dl>

          {user?.deliveryAdress && (
            <p className="mt-4 rounded-xl bg-surface-2 p-3 font-mono text-[11px] text-muted">
              Ships to: <span className="text-ink">{user.deliveryAdress}</span>
            </p>
          )}

          <button
            type="button"
            disabled
            title="Checkout isn't wired up yet — the API has no orders endpoint"
            className="mt-6 w-full cursor-not-allowed rounded-full bg-surface-2 px-6 py-3 text-sm font-semibold text-faint"
          >
            Checkout
          </button>
          <p className="mt-2 text-center text-[11px] text-faint">
            Checkout isn't available yet — this backend doesn't expose an orders endpoint.
          </p>
        </aside>
      </div>
    </div>
  );
}
