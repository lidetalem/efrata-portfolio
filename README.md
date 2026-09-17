# Efrata Alex — Creative Portfolio & Admin Dashboard

A production-ready personal portfolio platform for **Efrata Alex** (video editor, social
media manager, graphic designer and content creator, based in Ethiopia) with a complete
self-service admin dashboard and a bilingual (English + Amharic) AI assistant.

The public website is **English only**. Only the AI chatbot answers in both English and
Amharic — it detects the visitor's language automatically and replies in the same language.

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Feature overview](#2-feature-overview)
3. [Tech stack](#3-tech-stack)
4. [Project structure](#4-project-structure)
5. [Prerequisites](#5-prerequisites)
6. [Install](#6-install)
7. [Environment variables](#7-environment-variables)
8. [Database: Neon PostgreSQL setup](#8-database-neon-postgresql-setup)
9. [Zero-setup local database (no Postgres needed)](#9-zero-setup-local-database-no-postgres-needed)
10. [Migrations](#10-migrations)
11. [Seeding sample content](#11-seeding-sample-content)
12. [Creating the admin account](#12-creating-the-admin-account)
13. [Running in development](#13-running-in-development)
14. [Running in production](#14-running-in-production)
15. [Admin dashboard guide](#15-admin-dashboard-guide)
16. [AI chatbot configuration (Gemini)](#16-ai-chatbot-configuration-gemini)
17. [Amharic behaviour and safety rules](#17-amharic-behaviour-and-safety-rules)
18. [Media storage (images and video)](#18-media-storage-images-and-video)
19. [Email notifications](#19-email-notifications)
20. [Analytics](#20-analytics)
21. [Inquiry pipeline](#21-inquiry-pipeline)
22. [Comments and moderation](#22-comments-and-moderation)
23. [Theming: dark and light mode](#23-theming-dark-and-light-mode)
24. [Accessibility and SEO](#24-accessibility-and-seo)
25. [Deploying to Vercel](#25-deploying-to-vercel)
26. [Custom domain (efrataalex.com)](#26-custom-domain-efrataalexcom)
27. [Security notes](#27-security-notes)
28. [Replacing the sample data — checklist](#28-replacing-the-sample-data--checklist)
29. [npm scripts reference](#29-npm-scripts-reference)
30. [Troubleshooting](#30-troubleshooting)
31. [License and credits](#31-license-and-credits)

---

## 1. What this project is

A single Next.js application containing:

- **The public portfolio** (`/`) — hero, about, services, project case studies, testimonials,
  client logos, certifications, contact and hire pages.
- **The admin dashboard** (`/admin`) — password-protected. Every meaningful piece of content
  on the public site is editable from here: no code edits required to run the site day to day.
- **The AI assistant** — a floating chat widget that answers visitor questions about Efrata's
  services, process and availability, in English or Amharic, using a knowledge base that
  Efrata edits from the dashboard.

Everything is real and functional: real authentication (bcrypt + signed JWT session cookie),
a real relational database (PostgreSQL via Drizzle ORM), real file uploads, a real chatbot,
real inquiry storage. There are no mock screens or dead buttons.

## 2. Feature overview

**Public site**

- Animated hero with the tagline "I turn ideas into visual experiences." and
  EXPLORE MY WORK / HIRE ME calls to action
- Parallax layers, floating glass cards, scroll reveals, marquee of client logos —
  motion is used deliberately, not everywhere
- Projects index with category filters (`/projects?category=Video+Editing`)
- Full case-study pages per project: cover, gallery, embedded video player, client,
  date, role, tools, results, and visitor comments
- Services, testimonials, certifications, statistics sections
- Contact page and a detailed Hire Me project-request form with optional file attachment
- Custom 404 and error pages, `robots.txt`, `sitemap.xml`
- Dark and light themes, each designed separately, remembered per visitor and
  initialised from the operating-system preference
- Fully responsive from 360px upwards

**Admin dashboard** (13 sections)

Dashboard · Projects · Project media · Services · Messages · Testimonials · Certificates ·
Logos · Profile · Social links · AI knowledge · Comments · Settings

Each resource supports create, edit, delete, publish/unpublish, reordering and file upload
where relevant. The dashboard home shows live statistics, page-view analytics, popular
projects, recent messages and configuration warnings for anything not yet set up.

**AI assistant**

- Automatic language detection: Amharic in → Amharic out; English in → English out
- Answers grounded in the knowledge base plus live site data (services, projects, contact)
- Never invents facts. When it does not know: "I don't have that information yet.
  You can contact Efrata directly."
- Works even without an AI key, in database-only fallback mode
- Conversations are stored so Efrata can see what visitors ask

## 3. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Server Actions) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4, custom design tokens |
| Animation | Framer Motion (`framer-motion` v13) |
| Icons | lucide-react |
| Database | PostgreSQL (Neon recommended) via Drizzle ORM |
| Local fallback DB | PGlite (embedded Postgres, no install needed) |
| Auth | bcrypt password hashing + `jose` signed JWT in an httpOnly cookie |
| Validation | Zod |
| Media | Local disk in development; Cloudinary / Vercel Blob / Cloudflare R2 in production |
| AI | Google Gemini via an OpenAI-compatible endpoint (configurable) |
| Hosting | Vercel (any Node 20+ host works) |

## 4. Project structure

```
efrata-portfolio/
├─ drizzle/                  SQL migrations + metadata
├─ public/
│  └─ samples/               clearly-labelled placeholder imagery
├─ scripts/
│  ├─ seed.ts                inserts real brand data + labelled SAMPLE content
│  └─ create-admin.ts        interactive admin-account creation
├─ src/
│  ├─ app/
│  │  ├─ (site)/             public website routes
│  │  ├─ admin/              dashboard routes + server actions
│  │  ├─ api/                inquiries, chat, comments, analytics, upload
│  │  ├─ login/              admin sign-in
│  │  ├─ globals.css         design system (tokens, both themes)
│  │  ├─ robots.ts  sitemap.ts  error.tsx  not-found.tsx
│  ├─ components/            public UI + admin UI components
│  ├─ db/                    Drizzle schema and connection
│  └─ lib/                   auth, ai, storage, email, queries, rate-limit, resources
├─ .env.example
├─ drizzle.config.ts
├─ next.config.ts
└─ package.json
```

## 5. Prerequisites

- **Node.js 20 or newer** (`node -v`) and npm 10+
- A PostgreSQL database for production — a free [Neon](https://neon.tech) project is ideal
- Optional: a Google Gemini API key for the AI assistant
- Optional: a Cloudinary / Vercel Blob / Cloudflare R2 account for media in production
- Optional: a Resend API key for email notifications

Nothing else needs to be installed. If you skip PostgreSQL entirely, the app falls back to
an embedded database so you can run it immediately (see section 9).

## 6. Install

```bash
unzip efrata-portfolio.zip
cd efrata-portfolio
npm install
cp .env.example .env
```

Then open `.env` and fill it in as described next.

## 7. Environment variables

All configuration lives in `.env` (never commit it — `.gitignore` already excludes it).

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production | PostgreSQL connection string, e.g. Neon. Omit locally to use the embedded database. |
| `AUTH_SECRET` | **Yes** | Secret used to sign session cookies. Generate with `openssl rand -hex 32`. Minimum 32 characters. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Public site URL, e.g. `https://efrataalex.com`. Used for canonical URLs and the sitemap. |
| `AI_API_KEY` | Optional | Gemini API key. Without it the chatbot runs in knowledge-base-only mode. |
| `AI_MODEL` | Optional | Default `gemini-2.5-flash`. |
| `AI_BASE_URL` | Optional | OpenAI-compatible base URL. Defaults to Google's endpoint. |
| `STORAGE_PROVIDER` | Optional | `local` (default), `cloudinary`, `vercel-blob` or `r2`. |
| `CLOUDINARY_CLOUD_NAME` | If Cloudinary | Cloud name. |
| `STORAGE_API_KEY` / `STORAGE_API_SECRET` | If Cloudinary/R2 | Provider credentials. |
| `BLOB_READ_WRITE_TOKEN` | If Vercel Blob | Vercel Blob token. |
| `EMAIL_API_KEY` | Optional | Resend API key for new-inquiry emails. |
| `EMAIL_FROM` / `EMAIL_TO` | If email | Sender and recipient (Efrata's inbox). |
| `NEXT_PUBLIC_ANALYTICS` | Optional | Set to `off` to disable the built-in page-view counter. |

Never hardcode any of these values in source files, and never commit real secrets.

## 8. Database: Neon PostgreSQL setup

1. Create a free account at [neon.tech](https://neon.tech) and create a project.
2. In the project dashboard choose **Connection string → Pooled connection**.
3. Copy the string; it looks like
   `postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`.
4. Put it in `.env` as `DATABASE_URL=...` (keep `sslmode=require`).
5. Apply the schema: `npm run db:push` (or `npm run db:migrate` to run the SQL migrations).
6. Optional: `npm run seed` to insert Efrata's real brand details plus labelled sample content.

Use the **pooled** connection string on Vercel — serverless functions open many short-lived
connections.

## 9. Zero-setup local database (no Postgres needed)

If `DATABASE_URL` is not set, the app automatically uses **PGlite**, a real Postgres engine
compiled to WebAssembly, storing data in a local `./.pglite` folder. Everything works —
schema, seeding, admin login, uploads — with no database to install.

This is for local development only. Always set `DATABASE_URL` in production.

> `next.config.ts` lists `@electric-sql/pglite`, `postgres` and `bcryptjs` in
> `serverExternalPackages`. Do not remove that — the WebAssembly database will not load if it
> gets bundled.

## 10. Migrations

```bash
npm run db:generate   # regenerate SQL after editing src/db/schema.ts
npm run db:migrate    # apply the SQL migrations in ./drizzle
npm run db:push       # push the schema directly (fastest for a fresh database)
```

## 11. Seeding sample content

```bash
npm run seed
```

This inserts:

- Efrata's **real** details: name, roles, tagline, email `ephratahh16@gmail.com`,
  phone `+251900395342`, location Ethiopia, and the six real services
- Clearly labelled **placeholder** content: three `SAMPLE —` projects, sample testimonials,
  `Sample Brand 1–6` logos, sample certificates
- Six chatbot knowledge entries
- Statistics left blank (shown as "—" on the site) so no invented numbers appear
- Social links created but **unpublished** until real URLs are added

Seeding is idempotent: running it twice does not duplicate rows.

## 12. Creating the admin account

```bash
npm run create-admin
```

You are prompted for name, email and password. The password is hashed with bcrypt
(12 rounds) and only the hash is stored — plain-text passwords are never saved anywhere.
Run this once per environment (locally and again against the production database).

## 13. Running in development

```bash
npm run dev
# http://localhost:3000        public site
# http://localhost:3000/login  admin sign-in
```

## 14. Running in production

```bash
npm run build
npm run start        # serves on PORT (default 3000)
```

Requires Node 20+. `AUTH_SECRET` and `DATABASE_URL` must be set or the app will refuse to
sign anyone in (by design).

## 15. Admin dashboard guide

Sign in at `/login`, then:

| Section | What Efrata can do |
| --- | --- |
| **Dashboard** | See project/message/service counts, page views, popular projects, traffic sources, recent messages and setup warnings |
| **Projects** | Add, edit, delete, publish, feature and reorder case studies: title, slug, category, client, date, role, tools, description, results, cover image |
| **Project media** | Attach images and videos to a project, set order and captions |
| **Services** | Manage the six services (or add more): title, icon, category, description |
| **Messages** | Read every inquiry, change its status (NEW → CONTACTED → IN DISCUSSION → PROPOSAL SENT → COMPLETED → ARCHIVED), add private notes, archive, delete, export CSV |
| **Testimonials** | Add client quotes with name, role, company, rating, photo |
| **Certificates** | Certifications with organisation, date, image/PDF and verification link |
| **Logos** | Client/brand logos shown in the marquee |
| **Profile** | Name, roles, tagline, bio, experience, philosophy, approach, skills, portrait photo, About-me video, contact details |
| **Social links** | Platform, URL, order, published toggle |
| **AI knowledge** | Question/answer pairs the chatbot is allowed to use — the single place to teach it new facts |
| **Comments** | Approve, reject or delete visitor comments; every comment is held for moderation |
| **Settings** | Site title, SEO description, statistics, availability status, feature toggles |

Uploads go through an authenticated endpoint; only signed-in admins can upload.

## 16. AI chatbot configuration (Gemini)

1. Create a key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Add to `.env`:

```
AI_API_KEY=your-key
AI_MODEL=gemini-2.5-flash
```

3. Restart the app. The dashboard warning about `AI_API_KEY` disappears.

With no key the assistant still works: it answers from the knowledge base and live site data
and says when it cannot help. Add or edit answers under **Admin → AI knowledge**.

## 17. Amharic behaviour and safety rules

- The **website itself is English only**. There is deliberately no site-wide translation
  switch.
- The **chatbot** detects the language of each message (Ethiopic script → Amharic) and
  replies in that language.
- The assistant is instructed to use only the knowledge base and live site data. It must not
  invent prices, clients, credentials or availability. When a question is outside what it
  knows it replies: "I don't have that information yet. You can contact Efrata directly."

## 18. Media storage (images and video)

Large videos are **never** stored in PostgreSQL. The database stores URLs only.

- **Development**: `STORAGE_PROVIDER=local` writes to `public/uploads/`.
- **Production**: choose one of
  - **Cloudinary** — `STORAGE_PROVIDER=cloudinary`, `CLOUDINARY_CLOUD_NAME`,
    `STORAGE_API_KEY`, `STORAGE_API_SECRET`. Best option for video (transcoding, streaming).
  - **Vercel Blob** — `STORAGE_PROVIDER=vercel-blob`, `BLOB_READ_WRITE_TOKEN`.
  - **Cloudflare R2** — `STORAGE_PROVIDER=r2` plus the credentials above.

Vercel's filesystem is read-only, so `local` storage cannot be used in production. For very
large showreels you can also simply paste a YouTube or Vimeo URL into a project's video field.

`next.config.ts` already allows images from `res.cloudinary.com`,
`*.public.blob.vercel-storage.com` and `*.r2.dev`. Add any other host you use.

## 19. Email notifications

Set `EMAIL_API_KEY` (Resend), `EMAIL_FROM` (a verified sender) and `EMAIL_TO`
(Efrata's inbox). Every new inquiry then triggers an email. Without these, inquiries are
still saved and visible in **Admin → Messages** — nothing is lost, and the confirmation
screen says so plainly.

## 20. Analytics

A lightweight first-party beacon records page path, device type and referrer source — no
cookies, no third-party trackers, no personal data. View it on the dashboard. Disable with
`NEXT_PUBLIC_ANALYTICS=off`.

## 21. Inquiry pipeline

Statuses: **NEW → CONTACTED → IN DISCUSSION → PROPOSAL SENT → COMPLETED → ARCHIVED**.
Each inquiry stores name, email, phone, company, service, budget range, deadline, preferred
contact method, message, optional attachment, plus private internal notes. Export everything
to CSV from the Messages screen. The form is rate-limited and includes a hidden honeypot
field against spam bots, and requires explicit consent before storing details.

## 22. Comments and moderation

Visitors can comment on a project. Every comment is stored unapproved and appears publicly
only after Efrata approves it in **Admin → Comments**. Comments are rate-limited
(5 per 10 minutes per IP) and honeypot-protected. No email addresses or raw IPs are stored.

## 23. Theming: dark and light mode

Both themes are designed independently — separate surface, ink, accent and glow tokens, not
an inverted palette. The visitor's choice is stored under the `efrata-theme` key and the
first visit follows the OS `prefers-color-scheme`. There is no flash of the wrong theme:
the preference is applied before first paint.

## 24. Accessibility and SEO

Semantic landmarks, labelled controls, visible focus rings, keyboard-operable carousel and
chat, `prefers-reduced-motion` respected throughout, AA-contrast text in both themes.
Per-page metadata, Open Graph tags, `robots.txt` and a generated `sitemap.xml`.

## 25. Deploying to Vercel

1. Push the project to GitHub (`git init && git add . && git commit -m "Initial commit"`).
2. In Vercel choose **Add New → Project** and import the repository. The framework is
   detected automatically; no build-command changes are needed.
3. Add the environment variables from section 7 in **Settings → Environment Variables**.
   At minimum: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`.
4. Deploy.
5. Apply the schema to the production database and create the admin account, running these
   locally with the production `DATABASE_URL` in your `.env`:

```bash
npm run db:push
npm run seed          # optional
npm run create-admin
```

6. Configure a media provider (section 18) — local uploads do not work on Vercel.

## 26. Custom domain (efrataalex.com)

1. Vercel → project → **Settings → Domains → Add** → `efrataalex.com` (and `www`).
2. At your registrar, point the apex record to Vercel's IP `76.76.21.21` and add a `CNAME`
   for `www` to `cname.vercel-dns.com` (Vercel shows the exact values to use).
3. Wait for DNS to propagate; HTTPS is issued automatically.
4. Update `NEXT_PUBLIC_APP_URL=https://efrataalex.com` and redeploy so canonical URLs and
   the sitemap use the real domain.

## 27. Security notes

- Passwords are hashed with bcrypt (12 rounds). Plain text is never stored or logged.
- Sessions are signed JWTs in an httpOnly, SameSite=Lax cookie, 8-hour lifetime; the cookie
  is Secure in production.
- Every admin page and every mutating server action calls `requireAdmin()`. `/admin/**`
  redirects unauthenticated visitors to `/login`.
- Uploads are authenticated, size-limited and extension-checked.
- Public endpoints (inquiries, comments, chat) are rate-limited and honeypot-protected.
- All input is validated with Zod on the server.
- No secrets are committed: `.env*` is git-ignored and `.env.example` contains placeholders
  only.
- Rotate `AUTH_SECRET` to invalidate all existing sessions.

## 28. Replacing the sample data — checklist

Everything invented is labelled. Before going live, replace it all:

- [ ] **Projects** — delete the three `SAMPLE —` projects and add real case studies
- [ ] **Testimonials** — remove the sample quotes; add real client feedback only
- [ ] **Logos** — remove `Sample Brand 1–6`; upload real client logos you have permission to use
- [ ] **Certificates** — remove sample certificates; add genuine ones with verification links
- [ ] **Statistics** (Settings) — fill in the real numbers currently displayed as "—"
- [ ] **Profile portrait** — upload a real photo (a labelled placeholder shows until then)
- [ ] **About video** — upload the real showreel (labelled placeholder until then)
- [ ] **Social links** — add real URLs and publish them (they are hidden until then)
- [ ] **Sample images** in `public/samples/` — delete once real covers are uploaded
- [ ] **AI knowledge** — review every answer so the assistant only states true facts

## 29. npm scripts reference

| Script | Does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate SQL migrations from the schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push the schema straight to the database |
| `npm run seed` | Insert real brand data + labelled sample content |
| `npm run create-admin` | Create an admin account interactively |

## 30. Troubleshooting

**"AUTH_SECRET is missing or too short"** — add a 32+ character value to `.env`
(`openssl rand -hex 32`) and restart.

**Cannot sign in** — run `npm run create-admin`; confirm you are using the same database
(`DATABASE_URL`) that the account was created in.

**PGlite / WebAssembly errors** — confirm `serverExternalPackages` in `next.config.ts` still
lists `@electric-sql/pglite`. Delete `./.pglite` to reset the local database, then re-seed.

**Uploads fail in production** — Vercel's filesystem is read-only; configure Cloudinary,
Vercel Blob or R2 (section 18).

**Images do not render** — add the host to `images.remotePatterns` in `next.config.ts`.

**Chatbot only gives short generic answers** — `AI_API_KEY` is not set, so it is in
knowledge-base-only mode. Add the key, or add more entries under Admin → AI knowledge.

**No inquiry emails** — set `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`. Inquiries are always
saved regardless.

**Neon "too many connections"** — use the pooled connection string.

**Port already in use** — `PORT=3001 npm run dev`.

## 31. License and credits

Built for Efrata Alex. The source code is hers to use, modify and deploy.

Third-party components remain under their own licenses: Next.js, React, Tailwind CSS,
Drizzle ORM, PGlite, Framer Motion, lucide-react, jose, bcryptjs, Zod.

Placeholder imagery in `public/samples/` is AI-generated abstract artwork included purely as
labelled sample content — it depicts no real client work and should be deleted once real
project covers are uploaded.
