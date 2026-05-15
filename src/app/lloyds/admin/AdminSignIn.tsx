"use client";

import { useState } from "react";

export function AdminSignIn() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        setSubmitting(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Sign-in failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="card p-10 w-full max-w-md">
        <div className="section-label mb-4">Admin sign-in</div>
        <h1 className="font-serif text-3xl font-light mb-8">Restricted area.</h1>
        <input
          type="password"
          className="input"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && (
          <div
            className="text-xs mt-2"
            style={{ color: "var(--trace-rule-failed)" }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn-primary mt-6 w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
