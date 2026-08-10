import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// NOTE for Person 3: this page is intentionally minimal/unstyled - built to
// unblock testing the full app in the browser rather than only via Swagger.
// Please reskin to match the LOCKED cream/gold/ivory/black design system
// whenever you get here; the logic (signup/login calls, token handling)
// should not need to change.
//
// Reskinned to match the cream/gold/ivory/black design system. Every
// function below (handleLoginRequest, handleSignup, handleLogin, update)
// is untouched from the original — only JSX structure/classNames changed.

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLoginRequest() {
    // FastAPI's OAuth2PasswordRequestForm expects form-encoded data with
    // "username" (used for email) and "password" - NOT JSON. If Person 1's
    // login endpoint expects plain JSON instead, this needs to change to
    // api.post("/auth/login", { email: form.email, password: form.password }).
    const body = new URLSearchParams();
    body.append("username", form.email);
    body.append("password", form.password);

    // NOTE: api.js's response interceptor already unwraps response.data,
    // so `res` here is either {success, data: {access_token}, error} (if
    // Person 1's login route follows the team contract) or a raw
    // {access_token, token_type} (default OAuth2 behavior). Handle both.
    const res = await api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const token = res?.data?.access_token || res?.access_token;
    if (!token) {
      throw new Error("Login succeeded but no token was found in the response.");
    }
    login(token);
    navigate("/workspace");
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await handleLoginRequest();
    } catch (err) {
      setError(err.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await handleLoginRequest();
    } catch (err) {
      setError(err.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-6 py-16">
      {/* Background decorations, matching Hero's style */}
      <div className="absolute left-[-180px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[var(--gold-light)] opacity-40 blur-[120px]" />
      <div className="absolute right-[-180px] bottom-[-100px] h-[380px] w-[380px] rounded-full bg-white opacity-80 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Sparkles className="text-[var(--gold)]" size={22} />
          <span className="text-xl font-semibold text-[var(--text)]">FounderOS</span>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-md)]">
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {mode === "login" ? "Log in to FounderOS" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {mode === "login"
              ? "Welcome back."
              : "Build companies that deserve to exist."}
          </p>

          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="mt-6 flex flex-col gap-3"
          >
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--gold)]"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--gold)]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--gold)]"
              required
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Please wait..."
              ) : (
                <>
                  {mode === "login" ? "Log In" : "Sign Up"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-sm text-[var(--muted)] transition-colors hover:text-[var(--gold-dark)]"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </section>
  );
}
