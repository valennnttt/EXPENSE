"use client";

import { useState } from "react";
import { AuroraButton } from "@/app/components/magicui/aurora-button";

type Props = { mode: "login" | "register" };

export default function AuthForm({ mode }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Gagal");
      location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* avatar icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M20 21a8 8 0 10-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          {mode === "login" ? "Login Account" : "Create Account"}
        </h1>
        <p className="mt-2 mb-6 text-center text-gray-500">
          {mode === "login"
            ? "Welcome back, login to continue"
            : "Sign up to get started"}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M20 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <path d="M8 13h8M10 17h4" />
              </svg>
            </div>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              </svg>
            </div>
            <input
              type={showPwd ? "text" : "password"}
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-12 py-3 outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
                  <path d="M16.24 16.24A9.76 9.76 0 0 1 12 18c-5 0-9-4.5-10-6 0 0 2.5-3.5 6.5-5.3" />
                  <path d="M14.12 5.1A9.77 9.77 0 0 1 22 12s-1.05 1.47-2.88 2.94" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <AuroraButton type="submit" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in…"
                : "Creating…"
              : mode === "login"
              ? "Login Account"
              : "Create Account"}
          </AuroraButton>
        </form>
      </div>
    </div>
  );
}
