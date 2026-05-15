CREATE TABLE IF NOT EXISTS "access_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "name" text NOT NULL,
  "company" text NOT NULL,
  "role" text NOT NULL,
  "notes" text,
  "status" text NOT NULL,
  "requested_at" timestamp DEFAULT now() NOT NULL,
  "approved_at" timestamp
);

CREATE TABLE IF NOT EXISTS "magic_link_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "token_hash" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "session_token_hash" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "event" text NOT NULL,
  "demo" text,
  "metadata" jsonb,
  "timestamp" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "access_requests_email_idx" ON "access_requests" ("email");
CREATE INDEX IF NOT EXISTS "access_requests_status_idx" ON "access_requests" ("status");
CREATE INDEX IF NOT EXISTS "magic_link_tokens_token_hash_idx" ON "magic_link_tokens" ("token_hash");
CREATE INDEX IF NOT EXISTS "sessions_token_hash_idx" ON "sessions" ("session_token_hash");
CREATE INDEX IF NOT EXISTS "analytics_events_email_idx" ON "analytics_events" ("email");
