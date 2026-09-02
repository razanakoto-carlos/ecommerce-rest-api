import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { getCategories } from "../api/categories";
import { createProduct } from "../api/products";
import { apiErrorMessage } from "../lib/format";
import { CATEGORY_LABELS } from "../lib/constants";
import Spinner from "../components/Spinner";

const initialForm = { title: "", description: "", category: "", price: "", stock: "" };
const MAX_IMAGES = 8;

export default function SellerNewProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, MAX_IMAGES - images.length);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }
    if (!form.category) {
      toast.error("Pick a category");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach((file) => data.append("images", file));

    setSubmitting(true);
    createProduct(data)
      .then((product) => {
        toast.success("Product listed");
        navigate(`/products/${product._id}`);
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Couldn't create the listing")))
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-select-deep">Seller dashboard</p>
      <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">List a new product</h1>
      <p className="mt-2 text-sm text-muted">Fill in the details buyers need to say yes.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Title</span>
          <input
            required
            maxLength={100}
            value={form.title}
            onChange={update("title")}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="Wireless noise-cancelling headphones"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Description</span>
          <textarea
            required
            minLength={50}
            rows={4}
            value={form.description}
            onChange={update("description")}
            className="resize-none rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="At least 50 characters — specs, condition, what's in the box..."
          />
          <span className="self-end font-mono text-[11px] text-faint">{form.description.length}/50 min</span>
        </label>

        <div className="grid gap-6 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-1">
            <span className="text-muted">Category</span>
            <select
              required
              value={form.category}
              onChange={update("category")}
              className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            >
              <option value="" disabled>
                Select
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {CATEGORY_LABELS[c.name] || c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Price (USD)</span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              className="rounded-xl border border-line bg-bg px-3.5 py-2.5 font-mono text-ink outline-none focus:border-accent"
              placeholder="0.00"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Stock</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={update("stock")}
              className="rounded-xl border border-line bg-bg px-3.5 py-2.5 font-mono text-ink outline-none focus:border-accent"
              placeholder="0"
            />
          </label>
        </div>

        <div>
          <span className="text-sm text-muted">Images ({images.length}/{MAX_IMAGES})</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((file, i) => (
              <div key={`${file.name}-${i}`} className="relative h-20 w-20 overflow-hidden rounded-xl border border-line">
                <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg/80 text-ink"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-faint transition hover:border-accent hover:text-accent"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px]">Add</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          Publish listing
        </button>
      </form>
    </div>
  );
}
