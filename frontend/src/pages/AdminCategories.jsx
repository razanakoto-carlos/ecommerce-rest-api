import { useEffect, useRef, useState } from "react";
import { FolderPlus, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { getCategories, createCategory } from "../api/categories";
import { imageUrl, CATEGORY_LABELS } from "../lib/constants";
import { apiErrorMessage } from "../lib/format";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function AdminCategories() {
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!icon) {
      toast.error("Choose an icon image");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("icon", icon);

    setSubmitting(true);
    createCategory(data)
      .then(() => {
        toast.success("Category created");
        setName("");
        setIcon(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        refresh();
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Couldn't create category")))
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-select-deep">Admin</p>
      <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Categories</h1>
      <p className="mt-2 text-sm text-muted">Add the shelves buyers filter by.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-end sm:gap-4"
      >
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          <span className="text-muted">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="e.g. laptop"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Icon</span>
          <input
            ref={fileInputRef}
            required
            type="file"
            accept="image/png,image/jpeg,image/gif"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            className="w-full max-w-[220px] rounded-xl border border-line bg-bg px-3 py-2 text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:text-ink"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          Create
        </button>
      </form>

      <h2 className="mt-12 font-display text-lg text-ink">Existing categories</h2>

      {loading ? (
        <div className="flex justify-center py-16 text-accent">
          <Spinner className="h-6 w-6" />
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={FolderPlus} title="No categories yet" description="Create the first one above." />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-center"
            >
              <div className="h-14 w-14 overflow-hidden rounded-full bg-surface-2">
                <img src={imageUrl("category", category.image)} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="text-sm text-ink">{CATEGORY_LABELS[category.name] || category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
