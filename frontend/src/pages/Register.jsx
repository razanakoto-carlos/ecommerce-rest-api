import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/format";
import { API_URL } from "../lib/constants";
import AuthCard from "../components/AuthCard";
import Spinner from "../components/Spinner";

const initialForm = { name: "", email: "", password: "", deliveryAdress: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    register(form)
      .then(() => {
        toast.success("Account created — welcome to VOLT");
        navigate("/", { replace: true });
      })
      .catch((err) => toast.error(apiErrorMessage(err, "Couldn't create your account")))
      .finally(() => setSubmitting(false));
  }

  return (
    <AuthCard
      eyebrow="Create account"
      title="Join VOLT"
      subtitle="Register to buy, track your cart, and (if you sell) list products."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-select-deep hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Full name</span>
          <input
            required
            minLength={3}
            maxLength={30}
            value={form.name}
            onChange={update("name")}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="Ada Lovelace"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
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
            value={form.password}
            onChange={update("password")}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="At least 6 characters"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Delivery address</span>
          <input
            required
            minLength={6}
            value={form.deliveryAdress}
            onChange={update("deliveryAdress")}
            className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            placeholder="123 Main St, City"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {submitting && <Spinner className="h-4 w-4" />}
          Create account
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
        Continue with Google
      </a>
    </AuthCard>
  );
}
