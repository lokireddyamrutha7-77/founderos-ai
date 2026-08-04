import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// NOTE for Person 3: this page is intentionally minimal/unstyled - built to
// unblock testing the full app in the browser rather than only via Swagger.
// Please reskin to match the LOCKED cream/gold/ivory/black design system
// whenever you get here; the logic (signup/login calls, token handling)
// should not need to change.

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

    const res = await api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Handle either a wrapped {success, data: {access_token}} response or a
    // raw {access_token} response - whichever Person 1's endpoint returns.
    const token = res.data?.data?.access_token || res.data?.access_token;
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
      setError(err.response?.data?.error || err.message);
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
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto mt-20 px-6">
      <h1 className="text-2xl font-bold mb-1">
        {mode === "login" ? "Log in to Altora" : "Create your account"}
      </h1>
      <p className="text-neutral-500 mb-6 text-sm">
        {mode === "login"
          ? "Welcome back."
          : "Build companies that deserve to exist."}
      </p>

      <form
        onSubmit={mode === "login" ? handleLogin : handleSignup}
        className="flex flex-col gap-3 p-5 rounded-2xl border border-neutral-200 bg-white"
      >
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-full text-sm font-medium bg-[#1A1A1A] text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-sm text-neutral-500 hover:text-[#C9A961] transition"
      >
        {mode === "login"
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </section>
  );
}