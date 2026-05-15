"use client";

import { useState } from "react";
import type { AccessRequest } from "@/lib/db";

interface Event {
  id: string;
  email: string;
  event: string;
  demo: string | null;
  metadata: unknown;
  timestamp: Date;
}

export function AdminDashboard({
  requests,
  events,
}: {
  requests: AccessRequest[];
  events: Event[];
}) {
  const [tab, setTab] = useState<"pending" | "approved" | "denied" | "analytics">(
    "pending",
  );

  const filtered =
    tab === "analytics"
      ? null
      : requests.filter((r) => r.status === tab);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-light">Access management</h1>
        <button
          onClick={async () => {
            await fetch("/api/admin/signout", { method: "POST" });
            window.location.reload();
          }}
          className="text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-6 mb-8 border-b border-subtle">
        {(["pending", "approved", "denied", "analytics"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="pb-3 text-sm capitalize transition-colors relative"
            style={{
              color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)",
              borderBottom: tab === t ? "1px solid var(--accent-primary)" : "1px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {t}
            {t !== "analytics" && (
              <span
                className="ml-2 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {requests.filter((r) => r.status === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "analytics" ? (
        <AnalyticsPanel events={events} />
      ) : (
        <RequestsPanel requests={filtered ?? []} status={tab} />
      )}
    </div>
  );
}

function RequestsPanel({
  requests,
  status,
}: {
  requests: AccessRequest[];
  status: "pending" | "approved" | "denied";
}) {
  if (requests.length === 0) {
    return (
      <div className="card p-10 text-center" style={{ color: "var(--text-tertiary)" }}>
        No {status} requests.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <RequestCard key={req.id} req={req} />
      ))}
    </div>
  );
}

function RequestCard({ req }: { req: AccessRequest }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function act(action: "approve" | "deny") {
    setBusy(true);
    const res = await fetch(`/api/admin/requests/${req.id}/${action}`, {
      method: "POST",
    });
    setBusy(false);
    if (res.ok) {
      setDone(action === "approve" ? "Approved · magic link sent" : "Denied");
    } else {
      setDone(`Action failed`);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-serif text-lg">{req.name}</span>
            <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
              {req.email}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            <div>
              <span className="section-label text-xs">Company</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>{req.company}</span>
            </div>
            <div>
              <span className="section-label text-xs">Role</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>{req.role}</span>
            </div>
            <div>
              <span className="section-label text-xs">Requested</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>
                {new Date(req.requestedAt).toLocaleString()}
              </span>
            </div>
          </div>
          {req.notes && (
            <div
              className="mt-3 text-sm pl-3 border-l border-subtle"
              style={{ color: "var(--text-secondary)" }}
            >
              {req.notes}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {done ? (
            <span
              className="text-xs"
              style={{ color: "var(--trace-rule-fired)" }}
            >
              {done}
            </span>
          ) : req.status === "pending" ? (
            <>
              <button
                onClick={() => act("approve")}
                disabled={busy}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Approve
              </button>
              <button
                onClick={() => act("deny")}
                disabled={busy}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Deny
              </button>
            </>
          ) : (
            <span
              className="text-xs font-mono"
              style={{
                color:
                  req.status === "approved"
                    ? "var(--trace-rule-fired)"
                    : "var(--trace-rule-failed)",
              }}
            >
              {req.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="card p-10 text-center" style={{ color: "var(--text-tertiary)" }}>
        No analytics events yet.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <th className="text-left section-label px-4 py-3">When</th>
            <th className="text-left section-label px-4 py-3">Email</th>
            <th className="text-left section-label px-4 py-3">Event</th>
            <th className="text-left section-label px-4 py-3">Demo</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                {new Date(e.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{e.email}</td>
              <td className="px-4 py-3 font-mono text-xs">{e.event}</td>
              <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                {e.demo ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
