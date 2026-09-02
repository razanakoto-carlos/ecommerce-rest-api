import { stockStatus } from "../lib/format";

const TONE_CLASSES = {
  ok: "bg-accent-2/15 text-accent-2",
  warn: "bg-accent/15 text-accent",
  danger: "bg-danger/15 text-danger",
};

export default function StockBadge({ stock }) {
  const { label, tone } = stockStatus(stock);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${TONE_CLASSES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
