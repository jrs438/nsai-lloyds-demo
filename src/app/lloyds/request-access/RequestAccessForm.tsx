"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  company: z.string().min(2, "Required"),
  role: z.string().min(2, "Required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RequestAccessForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Submission failed");
    }
  }

  if (submitted) {
    return (
      <div className="card p-10">
        <div className="section-label mb-4" style={{ color: "var(--trace-rule-fired)" }}>
          Received
        </div>
        <h2 className="font-serif text-2xl font-light mb-4">
          Request submitted.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          If approved, a magic link will be sent to the email you provided. You
          can close this tab.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <Field label="Name" error={errors.name?.message}>
        <input className="input" {...register("name")} autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          className="input"
          type="email"
          {...register("email")}
          autoComplete="email"
        />
      </Field>
      <Field label="Company" error={errors.company?.message}>
        <input className="input" {...register("company")} autoComplete="organization" />
      </Field>
      <Field label="Role" error={errors.role?.message}>
        <input
          className="input"
          {...register("role")}
          placeholder="e.g. Active Underwriter, Marine Hull"
        />
      </Field>
      <Field label="Notes (optional)">
        <textarea
          className="input min-h-[100px]"
          {...register("notes")}
          placeholder="Anything we should know about your interest"
        />
      </Field>
      {submitError && (
        <div
          className="text-sm p-3 border"
          style={{
            borderColor: "var(--trace-rule-failed)",
            color: "var(--trace-rule-failed)",
          }}
        >
          {submitError}
        </div>
      )}
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit request →"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="section-label block mb-2">{label}</label>
      {children}
      {error && (
        <div
          className="text-xs mt-1"
          style={{ color: "var(--trace-rule-failed)" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
