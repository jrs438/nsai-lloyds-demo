"use client";

import { useState } from "react";

export function AccessCodeForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Invalid access code");
        setSubmitting(false);
        return;
      }
      window.location.href = "/lloyds/demos";
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Enter access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || code.length === 0}
        >
          {submitting ? "Checking…" : "Enter →"}
        </button>
      </div>
      {error && (
        <div
          className="text-xs"
          style={{ color: "var(--trace-rule-failed)" }}
        >
          {error}
        </div>
      )}
    </form>
  );
}
