function BoltMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" className="fill-accent" />
      <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" className="fill-bg" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BoltMark className="h-7 w-7 shrink-0" />
      <span className="font-display text-lg tracking-tight text-ink">
        VOLT
      </span>
    </span>
  );
}

export { BoltMark };
