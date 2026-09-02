import Logo from "./Logo";

export default function AuthCard({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Logo className="mx-auto" />
      <div className="mt-8 rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
    </div>
  );
}
