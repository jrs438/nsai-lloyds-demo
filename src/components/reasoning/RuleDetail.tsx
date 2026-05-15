"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { SerializableRule, RuleResult } from "@/ontology/rules/types";

interface RuleDetailProps {
  rule: SerializableRule | null;
  result: RuleResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RuleDetail({ rule, result, open, onOpenChange }: RuleDetailProps) {
  if (!rule) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.7)" }}
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto p-8"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div
                className="font-mono text-xs mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {rule.id} · v{rule.version}
              </div>
              <Dialog.Title className="font-serif text-2xl font-light">
                {rule.name}
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="p-1 hover:opacity-70"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            <Detail label="Description">
              <p style={{ color: "var(--text-secondary)" }}>{rule.description}</p>
            </Detail>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailInline label="Domain">{rule.domain}</DetailInline>
              <DetailInline label="Severity">{rule.severity}</DetailInline>
              <DetailInline label="Evaluation type">{rule.evaluationType}</DetailInline>
              <DetailInline label="Auditability">{rule.auditability}</DetailInline>
            </div>

            <Detail label="Authority">
              <div className="space-y-1 text-sm">
                <div>
                  <span style={{ color: "var(--text-tertiary)" }}>Type</span>{" "}
                  <span className="font-mono">{rule.authority.type}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-tertiary)" }}>Reference</span>{" "}
                  {rule.authority.reference}
                </div>
                <div>
                  <span style={{ color: "var(--text-tertiary)" }}>Effective</span>{" "}
                  <span className="font-mono">{rule.authority.effective}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-tertiary)" }}>Last reviewed</span>{" "}
                  <span className="font-mono">{rule.authority.lastReviewed}</span>
                </div>
                <div>
                  <span style={{ color: "var(--text-tertiary)" }}>Owner</span>{" "}
                  {rule.authority.owner}
                </div>
              </div>
            </Detail>

            {result && (
              <Detail label="Evaluation result">
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span style={{ color: "var(--text-tertiary)" }}>fired</span>{" "}
                    <span
                      style={{
                        color: result.fired
                          ? "var(--trace-rule-fired)"
                          : "var(--trace-rule-failed)",
                      }}
                    >
                      {String(result.fired)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-tertiary)" }}>applicable</span>{" "}
                    <span>{String(result.applicable)}</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-tertiary)" }}>confidence</span>{" "}
                    <span>{result.confidence}</span>
                  </div>
                  {result.value !== undefined && (
                    <div>
                      <span style={{ color: "var(--text-tertiary)" }}>value</span>{" "}
                      <span>
                        {typeof result.value === "number"
                          ? result.value.toFixed(4)
                          : String(result.value)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "var(--text-tertiary)" }}>reasoning</span>{" "}
                    <span style={{ color: "var(--text-primary)" }}>
                      {result.reasoning}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-tertiary)" }}>factsUsed</span>{" "}
                    <span>[{result.factsUsed.join(", ")}]</span>
                  </div>
                </div>
              </Detail>
            )}

            <Detail label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {rule.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-2 py-0.5"
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Detail>

            {rule.notes && (
              <Detail label="Notes">
                <p
                  className="text-sm italic"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {rule.notes}
                </p>
              </Detail>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="section-label mb-2">{label}</div>
      {children}
    </div>
  );
}

function DetailInline({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="section-label mb-1" style={{ fontSize: "0.65rem" }}>
        {label}
      </div>
      <div className="font-mono text-sm">{children}</div>
    </div>
  );
}
