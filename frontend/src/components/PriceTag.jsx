import { formatPrice } from "../lib/format";

export default function PriceTag({ price, size = "md" }) {
  const sizing = size === "lg" ? "text-lg py-2 pl-5 pr-4" : "text-sm py-1.5 pl-4 pr-3";

  return (
    <div className="relative -rotate-3 transition-transform duration-300 group-hover:rotate-0">
      <div
        className={`bg-accent text-accent-ink font-mono font-bold leading-none shadow-[0_6px_16px_rgba(36,36,38,0.28)] ${sizing}`}
        style={{ clipPath: "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)" }}
      >
        {formatPrice(price)}
      </div>
      <span className="absolute left-[6px] top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-accent-ink/70" />
    </div>
  );
}
