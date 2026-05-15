# NSAI Lloyd's Demo Platform

Gated demonstration platform for `nsai4insurance.com` showcasing neurosymbolic AI for the London/Lloyd's market.

## Phase 1 scope (this branch)

Phase 1 ships the foundation plus Demo 01 (Broker Intelligence):

- Next.js 14 (App Router) on Vercel
- Dark serif design system matching `nsai4insurance.com`
- Email-gated access: request → manual approve → magic link
- Admin dashboard at `/lloyds/admin` for approving requests
- Competitive positioning page at `/lloyds/positioning`
- Demo 01 — Broker Intelligence with three pre-built marine hull submissions, 24 inspectable rules across 8 fictional syndicates, deterministic reasoning trace, and an LLM comparison view

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in AUTH_SECRET (openssl rand -base64 32) and POSTGRES_URL minimum
npm run dev
```

For full functionality (email approval), also set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`.

To generate an admin password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" "your-password-here"
```

## Database setup

Vercel Postgres. After provisioning, run the migration SQL in `drizzle/0000_init.sql` against the database, e.g. via Vercel's SQL console.

## Deployment

This repo is deployed as its own Vercel project. Route to `lloyds.nsai4insurance.com` (subdomain) or `nsai4insurance.com/lloyds/*` (rewrite).

Required env vars in Vercel:

- `AUTH_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `POSTGRES_URL` (and other Vercel Postgres vars, auto-attached)
- `NEXT_PUBLIC_BASE_URL` — public origin (e.g. `https://lloyds.nsai4insurance.com`)

## Architecture

- **Ontology** lives in `src/ontology/`. Rules, syndicates, classes, wordings. Each rule is one file. Real evaluation logic; pre-authored submissions.
- **Placement engine** in `src/lib/placement-engine.ts` runs each pre-built submission through all rules against all syndicates and produces a deterministic recommendation. Same inputs → same outputs.
- **Reasoning trace** component in `src/components/reasoning/` is the visible signature of NSAI — 4-stage trace (extraction · ontology mapping · rule evaluation · derivation) plus inspectable rule details and LLM comparison.

## Subsequent phases

- Phase 2: Lead Underwriting Workbench
- Phase 3: Claims Intelligence
- Phase 4: Wordings & Coverage Analysis
- Phase 5: Polish, analytics, mobile responsive
