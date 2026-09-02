import { Link } from "react-router-dom";
import { BoltMark } from "../components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <BoltMark className="h-10 w-10 opacity-60" />
      <p className="mt-6 font-mono text-xs uppercase tracking-wide text-faint">404 / short circuit</p>
      <h1 className="mt-2 font-display text-3xl text-ink">This page isn't wired up.</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist, moved, or never had current running through it.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
      >
        Back to home
      </Link>
    </div>
  );
}
