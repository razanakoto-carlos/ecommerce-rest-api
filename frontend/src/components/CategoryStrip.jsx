import { imageUrl, CATEGORY_LABELS } from "../lib/constants";

export default function CategoryStrip({ categories, active, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
          !active
            ? "border-accent bg-accent text-accent-ink"
            : "border-line text-muted hover:border-accent/60 hover:text-ink"
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const isActive = active === category.name;
        return (
          <button
            key={category._id}
            type="button"
            onClick={() => onSelect(category.name)}
            className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 font-mono text-xs uppercase tracking-wide transition ${
              isActive
                ? "border-accent bg-accent text-accent-ink"
                : "border-line text-muted hover:border-accent/60 hover:text-ink"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-surface-2">
              <img src={imageUrl("category", category.image)} alt="" className="h-full w-full object-cover" />
            </span>
            {CATEGORY_LABELS[category.name] || category.name}
          </button>
        );
      })}
    </div>
  );
}
