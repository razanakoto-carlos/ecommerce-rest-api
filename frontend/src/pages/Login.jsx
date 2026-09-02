import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/format";
import { API_URL } from "../lib/constants";
import AuthCard from "../components/AuthCard";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.get("error") === "google_auth_failed") {
      toast.error("Google sign-in failed. Try again or use email + password.");
    }
  }, [params]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    login(email, password)
      .then(() => {
        toast.success("Welcome back");
        navigate(location.state?.from || "/", { replace: true });
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Invalid credentials")))
      .finally(() => setSubmitting(false));
  }

  return (
    <AuthCard
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Log in to check out and manage your listings."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-select-deep hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting && <Spinner className="h-4 w-4" />}
          Log in
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <a
        href={`${API_URL}/auth/google`}
        className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:border-accent"
      >
        <GoogleMark />
        Continue with Google
      </a>
    </AuthCard>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M21.6 12.23c0-.72-.06-1.4-.18-2.05H12v3.88h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 3-4.32 3-7.35Z"
      />
      <path
        fill="#FF3D00"
        d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.6-4.12H3.05v2.58A10 10 0 0 0 12 22Z"
      />
      <path fill="#4CAF50" d="M6.4 13.92a5.98 5.98 0 0 1 0-3.84V7.5H3.05a10 10 0 0 0 0 9l3.35-2.58Z" />
      <path
        fill="#1976D2"
        d="M12 6.04c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.95 5.5l3.35 2.58C7.2 7.8 9.4 6.04 12 6.04Z"
      />
    </svg>
  );
}
