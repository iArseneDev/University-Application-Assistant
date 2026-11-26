# University Application Assistant

University Application Assistant is a university admission portal for students and administrators. It includes a public information site, student application dashboard, admin console, and a JSON API.

## Project structure

- `ur-app-frontend/` — Next.js 14 App Router, React, TypeScript, Tailwind CSS, and Axios.
- `ur-app-backend/` — Hono API deployed to Cloudflare Workers, with Cloudflare D1 (SQLite) persistence.
- `ur-app-backend/schema.sql` — complete schema for a new database.
- `ur-app-backend/migrations/` — one-time migrations for existing databases.

## Features

- Student registration and login, profile, self-reported academic results, payment receipt submission, and application tracking.
- Admin management of students, universities, colleges, programs, subjects, blogs, application decisions, and payment review.
- Public landing pages, published blog content, and a dashboard that adapts to the authenticated account role.
- HTTP-only cookie sessions for browser use; API bearer tokens remain accepted for compatible non-browser clients.

Payments are currently recorded for manual administrator verification. The app does not call MTN or another payment provider to confirm a transaction. Student-entered grades and points are also self-reported and should not be treated as verified credentials.

## Requirements

- Node.js 20 or newer.
- `pnpm` for the frontend (the repository includes `pnpm-lock.yaml`).
- `npm` for the backend.
- A Cloudflare account and a D1 database for deployment. Wrangler is included in the backend development dependencies only if added separately; use `npx wrangler` or install Wrangler in your environment.

## Local development

### 1. Configure the backend

```sh
cd ur-app-backend
npm install
npx wrangler d1 execute ur-app-db --local --file=./schema.sql
npm run dev
```

Use a random `JWT_SECRET` of at least 32 characters. Supply a unique admin email and a strong admin password in `.dev.vars`. The Worker creates the configured admin account on its first request if that email does not already exist. Changing `ADMIN_PASSWORD` does not reset an existing account; update that account through a dedicated password-reset process instead.

For local D1, set local secrets in `.dev.vars` in `ur-app-backend/` (do not commit it):

```dotenv
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
ADMIN_EMAIL=admin@example.test
ADMIN_PASSWORD=replace-with-a-strong-password
FRONTEND_ORIGIN=http://localhost:3000
```

The backend listens on `http://localhost:8787` by default.

### 2. Configure and run the frontend

In another terminal:

```sh
cd ur-app-frontend
pnpm install
```

Create `ur-app-frontend/.env.local` (do not commit it):

```dotenv
BACKEND_URL=http://localhost:8787
```

Then run:

```sh
pnpm dev
```

Open `http://localhost:3000`. The Next.js rewrite forwards `/api/*` requests to the backend. Keep `BACKEND_URL` as the backend origin; the rewrite adds `/api`.

## Database setup and upgrades

For a new database, apply `ur-app-backend/schema.sql` once. It creates the full current schema, including payment linkage and atomic payment-claim tracking. `ur-app-backend/pay.sql` is an optional, repeatable script for the messages table; it preserves existing rows.

For an existing database that already has `payments`, `applications`, and `applications.payment_id`, back up the database and apply `ur-app-backend/migrations/0002_atomic_application_claims.sql` once. Do not run that migration on a fresh database: the column is already present in `schema.sql`. Existing deployments should confirm their actual table and column state before applying migrations.

Example remote commands:

```sh
cd ur-app-backend
npx wrangler d1 execute ur-app-db --remote --file=./schema.sql
npx wrangler secret put JWT_SECRET
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put FRONTEND_ORIGIN
```

Use the correct database name and deployment environment for your Cloudflare account. Back up production data before applying schema changes.

## API overview

All API routes are mounted under `/api`.

| Area | Endpoints | Access |
| --- | --- | --- |
| Session | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Public for register/login/logout; authenticated for `me` |
| Student profile | `GET/POST/PUT /student/profile` | Authenticated account's own profile |
| Results | `GET/POST /results` | Authenticated account's own results |
| Universities, colleges, subjects, programs | `GET` list/detail; `POST/PUT/DELETE` writes | Authenticated reads; admin writes |
| Payments | `POST /payments`, `GET /payments/my`, `GET /payments/check` | Student's own payments |
| Payment review | `GET /payments/all`, `PATCH /payments/:id` | Admin |
| Applications | `GET/POST /applications`, `GET /applications/all`, `PATCH /applications/:id` | Student's own list/create; admin list/review |
| Blogs | `GET /blogs`, `GET /blogs/:id`, `/blogs/admin/*` writes | Public reads; admin writes |
| Student administration | `GET /students`, `GET /admin/student/:id` | Admin |

Mutating a program, payment decision, application status, or blog requires an admin role enforced by the API. Frontend navigation is not an authorization boundary; API checks are authoritative.

## Security and deployment notes

- Configure signing keys and admin credentials as Wrangler secrets. Do not put secrets in `wrangler.toml`, frontend environment variables, or source control.
- **Rotate the JWT signing key and admin password that were previously present in `wrangler.toml`.** Removing them from the file does not invalidate copied credentials or tokens. Set new values in the Cloudflare environment and verify the admin password separately.
- Browser login sessions use an `HttpOnly`, `SameSite=Lax` cookie. Use HTTPS in production; cookies are marked `Secure` on HTTPS requests.
- Set `FRONTEND_ORIGIN` to the exact deployed frontend origin so the API's credentialed CORS policy accepts only that origin.
- Protect `.dev.vars` and `.env.local`; both are local-only configuration files and must not be committed.
- Admin account bootstrap runs once per Worker isolate when configured. For production account lifecycle, use a deliberate admin provisioning and password-reset process.
- Self-reported results and manually reviewed payment receipts need independent verification before they are used for admission or financial decisions.

## Scripts

Backend (`ur-app-backend/`):

- `npm run dev` — run the Worker locally with Wrangler.
- `npm run build` — TypeScript build check.
- `npm start` — run the Worker locally with Wrangler.
- `npm run deploy` — deploy the Worker with Wrangler.

Frontend (`ur-app-frontend/`):

- `pnpm dev` — development server.
- `pnpm build` — production build.
- `pnpm start` — serve a production build.
- `pnpm lint` — lint the Next.js app.

## Current limitations

- Payment confirmation is a manual workflow; no payment provider webhook or reconciliation is integrated.
- Student-entered results are not checked against official examination data.
- The schema reserves tables for requirements, recommendations, documents, and cutoffs; the full recommendation/document verification workflows are not yet implemented end to end.
- Production secret rotation and deployed D1 migration state must be handled in the relevant Cloudflare account; source changes cannot rotate remote credentials by themselves.
