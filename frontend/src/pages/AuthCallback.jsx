import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { applyToken } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");
    if (!token) {
      toast.error("Google sign-in didn't return a token");
      navigate("/login", { replace: true });
      return;
    }

    applyToken(token)
      .then(() => {
        toast.success("Signed in with Google");
        navigate("/", { replace: true });
      })
      .catch(() => {
        toast.error("Couldn't finish signing you in");
        navigate("/login", { replace: true });
      });
  }, [params, applyToken, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-accent">
      <Spinner className="h-8 w-8" />
      <p className="font-mono text-xs uppercase tracking-wide text-muted">Signing you in...</p>
    </div>
  );
}
