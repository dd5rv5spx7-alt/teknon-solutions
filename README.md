# Teknon Solutions — Website

A complete React + Vite + Tailwind site for Teknon Solutions, built from your brief: hero, stats,
about, why-choose-us, programs, technologies, training process, courses (with search/filter),
student benefits, testimonials, gallery, pricing, FAQ, CTA, contact form, and footer — plus dark
mode, a floating WhatsApp button, and scroll animations throughout.

> Note: your message said the domain is **ateknonsolutions.com**. Every instruction below uses
> that exact spelling. If that was a typo and you actually meant `teknonsolutions.com`, just
> swap it in wherever you see it.

---

## 1. Before you launch — things to personalize

The site is fully built and ready to deploy, but a few pieces are placeholders you should swap
out before going live:

| What | Where | Why |
|---|---|---|
| Contact form won't send email yet | `.env.example` → `RESEND_API_KEY` | Submits to a real `/api/enquiry` backend now (stores to Supabase + emails via Resend), but needs a free [Resend](https://resend.com) API key set in Vercel first. Until then, it automatically falls back to WhatsApp — nothing is ever lost either way. See **Section 4.5** below. |
| Admin login isn't connected yet | `.env.example` → `VITE_SUPABASE_URL` etc. | Needs a free [Supabase](https://supabase.com) project — see **Section 4.5**. |
| Social media links go nowhere (`#`) | `src/data/siteData.js` → `SOCIAL_LINKS` | Add your real Instagram/LinkedIn/GitHub/Facebook/YouTube URLs. |
| Gallery shows labeled placeholder tiles, not real photos | `src/components/Gallery.jsx` | Intentional — swap these for real classroom/workshop/hackathon photos when you have them. I avoided using random stock photos so nothing on the site misrepresents your actual classes. |
| Testimonials are illustrative samples | `src/data/siteData.js` → `TESTIMONIALS` | Written to match the tone you described, but they're not real students yet. Replace with real quotes once you have them — this matters for trust/credibility. |
| Founder quote | `src/components/About.jsx` | Pulled from your reference image (William Carie Amudala). Edit the quote text if you'd like something more specific. |

Everything else — pricing, program details, tech stack, FAQ, contact info — is already filled in
from your brief and editable in **`src/data/siteData.js`**, which is written as one central file
specifically so you (or anyone) can update content without touching component code.

---

## 2. Preview it locally (optional)

Only needed if you want to see it on your own computer before deploying. Requires
[Node.js](https://nodejs.org) (v18+) installed.

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

To build the production version yourself: `npm run build` (outputs to `dist/`).

---

## 3. Deploy — easiest path (no terminal required)

**Step A — Put the project on GitHub**
1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **New repository**, name it `teknon-solutions`, keep it Public or Private, click **Create**.
3. On the new repo page, click **uploading an existing file**, then drag in *all the files and
   folders* from this project (everything except `node_modules`, which doesn't exist yet anyway).
4. Commit the files.

**Step B — Deploy on Vercel**
1. Create a free account at [vercel.com](https://vercel.com) (sign up with GitHub — one click).
2. Click **Add New → Project**, select your `teknon-solutions` repo, click **Import**.
3. Vercel auto-detects Vite — leave the defaults, click **Deploy**.
4. In 1–2 minutes you'll get a live link like `teknon-solutions.vercel.app`. That's your site, live.

*(Netlify works identically: [netlify.com](https://netlify.com) → **Add new site → Import an
existing project** → pick the same GitHub repo → deploy.)*

---

## 4. Connect ateknonsolutions.com (GoDaddy → Vercel)

1. In your Vercel project, go to **Settings → Domains** → enter `ateknonsolutions.com` → **Add**.
2. Vercel will show you DNS records to add. They'll look like this:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   (Use the exact values Vercel shows you on that screen — they occasionally update their IPs.)

3. Log into **GoDaddy** → **My Products** → find `ateknonsolutions.com` → **DNS** → **Manage DNS**.
4. Under DNS Records:
   - Edit (or add) the **A** record: Name `@`, Value `76.76.21.21`, TTL default.
   - Edit (or add) the **CNAME** record: Name `www`, Value `cname.vercel-dns.com`.
   - Delete any conflicting default GoDaddy "Parked Domain" A/CNAME records pointing elsewhere.
5. Save. DNS changes usually go live in 10–60 minutes (occasionally up to 24 hours).
6. Back in Vercel, the domain will show **Valid Configuration** once it detects the change — HTTPS
   is issued automatically, no extra steps needed.

**If you deploy to Netlify instead:** Site settings → Domain management → Add custom domain →
Netlify will give you an A record (`75.2.60.5`) for `@` and a CNAME for `www` pointing to your
`[yoursite].netlify.app` — same GoDaddy steps as above, just with Netlify's values.

---

## 4.5. Backend & admin login setup

The contact form and `/admin` login are real, working code now — but they need credentials from
you before they actually do anything, because I can't create accounts or connect to services on
your behalf. Two independent services, ~10 minutes total:

**A. Email (Titan Mail SMTP) — makes the contact form, payment receipts, and the daily digest send real email**

Sends straight through your existing Titan Mail mailbox (e.g. `info@ateknonsolutions.com`) —
no separate email-service account, no sender-domain verification dance. Every email the site
sends shows up in that mailbox's own Sent folder, and replies land straight in the inbox you
already check.

> ⚠️ **Before you set this up:** a DNS check on `ateknonsolutions.com` found its MX and SPF
> records currently pointing at `secureserver.net` (GoDaddy), not `titan.email`. If that's still
> true, sending through `smtp.titan.email` will likely fail SPF/DKIM checks — and since the domain
> already publishes a DMARC policy of `p=quarantine`, receiving inboxes (Gmail, Outlook, etc.) may
> route your payment receipts and enquiry confirmations straight to spam, or reject them outright.
> **First, confirm in your domain host's control panel which service `info@ateknonsolutions.com`
> is actually hosted on.** If it's genuinely Titan Mail, add Titan's required SPF include and DKIM
> records to your DNS (from Titan's own dashboard) before relying on this for real traffic. If the
> mailbox is actually on GoDaddy, set `SMTP_HOST` to GoDaddy's SMTP relay instead (e.g.
> `smtpout.secureserver.net`) so it matches what DNS already authorizes. Either way, send yourself
> a real test email once configured and check it with [mail-tester.com](https://www.mail-tester.com)
> before trusting it for customer-facing mail.

1. Open your Titan Mail webmail (usually reachable from your domain host's email dashboard) and
   confirm the outgoing (SMTP) server under Settings — it's typically `smtp.titan.email` on port
   `465`. Only deviate from those if your provider's settings page shows something different.
2. In Vercel: **Project → Settings → Environment Variables** → add:
   - `SMTP_HOST` — `smtp.titan.email` (or whatever your provider showed)
   - `SMTP_PORT` — `465`
   - `SMTP_USER` — the full mailbox address, e.g. `info@ateknonsolutions.com`
   - `SMTP_PASSWORD` — that mailbox's password (as sensitive as any other secret in this
     project — never commit it, never expose it to the browser)
   - `SMTP_FROM_NAME` — the display name on outgoing mail, e.g. `A Teknon Solutions`
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy). Test by submitting the contact form.
4. Optional: add `CRON_SECRET` (any long random string, e.g. from `openssl rand -hex 32`) — Vercel
   automatically attaches it as an `Authorization` header on every scheduled call to the daily
   digest (see **4.8** below), so the endpoint can't be triggered by anyone who finds the URL.

**B. Auth + database (Supabase) — makes `/admin/login` work and stores enquiries**
1. Sign up free at [supabase.com](https://supabase.com/dashboard) → **New Project**.
2. Once it's created: **SQL Editor** → **New query** → paste the entire contents of
   `supabase/schema.sql` from this project → **Run**. This creates the `profiles` and `enquiries`
   tables with the correct permissions.
   > Already set Supabase up before this update? Don't re-run `schema.sql` — instead run
   > `supabase/002_enrich_enquiries.sql`, which safely adds the new fields (college, year,
   > source page, IP, user agent) and status options to your existing `enquiries` table.
3. **Project Settings → API** → copy three values:
   - `Project URL` → Vercel env var `VITE_SUPABASE_URL`
   - `anon public` key → Vercel env var `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → Vercel env var `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this one secret —
     never put `VITE_` in front of it, never commit it, never share it)
4. Redeploy.
5. **Create your own admin account** (there's no public sign-up page by design — staff accounts
   aren't self-serve):
   - Supabase Dashboard → **Authentication → Users → Add user** → enter your email + a password.
   - Back in **SQL Editor**, run:
     ```sql
     update public.profiles set role = 'admin' where id =
       (select id from auth.users where email = 'you@ateknonsolutions.com');
     ```
   - Now go to `yoursite.com/admin/login` and sign in with that email/password.

Neither of these blocks the other — the site works fine with just one configured, or neither
(contact form falls back to WhatsApp, `/admin/login` shows a clear "not connected yet" message
instead of pretending to work).

---

## 4.6. People admin (Students & Faculty)

Once you're signed in as an admin at `/admin`, there's a **People** tab alongside Enquiries.

- **Add Person** creates a real account and emails them an invite link to set their own password —
  you type in name, email, phone, and pick Student or Faculty. You never see or handle a password.
- The invite email is sent by **Supabase's own built-in auth email** — separate from Resend, no
  extra setup needed, though Supabase's default sender has low volume limits meant for getting
  started. For real usage past a handful of invites, configure custom SMTP under Supabase
  **Authentication → Settings → SMTP Settings** (their free-tier default is not meant for volume).
- Faculty can view the whole roster (they need to see their students) but can't add people or
  change anyone's role — that stays admin-only, enforced both in the UI and by the database's Row
  Level Security policies (so it's not just a UI restriction someone could bypass).
- "Deactivate" is a soft action (`status = 'inactive'`) — it doesn't delete the account, just
  flags it. Reactivate any time.
- Admin accounts are **never** created through this UI on purpose — that stays the manual SQL
  process in section 4.5, since it's the most sensitive role in the system.

Already ran `schema.sql` before this update? Run `supabase/003_people_admin.sql` too — it adds the
columns and permissions this needs (including backfilling email onto existing accounts, which
`profiles` didn't store before now).

---

## 4.7. Payments (Razorpay)

The Pricing section now has real "Pay Now" buttons on the Starter/Professional/Advanced tiers
(Enterprise stays a "Contact us" CTA since it's Custom pricing). ~10 minutes to set up:

1. Sign up free at [dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup).
2. Stay in **Test Mode** first (the toggle in the top-right of the dashboard) — this lets you run
   the entire checkout flow with test card numbers and no real money before going live.
3. **Settings → API Keys → Generate Test Key** → copy the Key ID and Key Secret.
4. In Vercel: **Project → Settings → Environment Variables** → add `RAZORPAY_KEY_ID` and
   `RAZORPAY_KEY_SECRET`.
5. Redeploy, then try a payment yourself — Razorpay's test-mode card number is
   `4111 1111 1111 1111` with any future expiry date and any CVV.
6. Optional but recommended before taking real money: **Settings → Webhooks → Add New Webhook**,
   URL `https://yoursite.com/api/razorpay-webhook`, subscribe to `payment.captured`,
   `payment.failed`, and `refund.processed`, and add the webhook secret it gives you as
   `RAZORPAY_WEBHOOK_SECRET` in Vercel too. This is a reliability backstop — if someone pays but
   closes the tab before the browser can confirm it, the webhook (delivered straight from
   Razorpay's servers, not the customer's browser) still records the payment; the other two events
   keep failed payments and refunds (including ones issued straight from the Razorpay dashboard)
   in sync with the `payments` table too. Checkout works without any of this configured, just
   slightly less robust against those edge cases.
7. When you're ready for real payments: **Settings → API Keys → Generate Live Key**, and swap the
   two Vercel env vars for the live values. Razorpay requires KYC/business verification before
   activating live mode — that's their process, not something to configure here.

Every payment amount is resolved server-side from a fixed price map (`api/_lib/pricing.js`) — the
browser only ever sends which tier was selected, never an amount, so the checkout can't be tricked
into charging less than the real price. Payment success is verified via Razorpay's cryptographic
signature (`api/verify-payment.js`) before anything is recorded — a fabricated "success" POSTed
straight to that endpoint without a valid signature is rejected.

**Who gets emailed on a payment, and when:** the moment a payment is verified, both the customer
(a receipt) and the team (`info@ateknonsolutions.com`) get an email. Two independent paths can
each trigger this — the browser calling `/api/verify-payment` right after checkout, and the
Razorpay webhook (`/api/razorpay-webhook`) as a backstop if the browser never got the chance to
call home (closed tab, dropped connection). `/api/create-order` writes a `created` row the moment
checkout starts (before any payment happens); both paths then race to claim and flip that same row
to `paid` (see `api/_lib/payments.js`), and only whichever one *wins the claim* sends the receipt
emails — so a customer who closes the tab right after paying still gets a receipt (via the
webhook), and a customer whose browser call *does* land never gets two.

A failed or abandoned payment (declined card, closed checkout mid-payment) flips that same `created`
row to `failed` and fires a quiet admin-only alert — the customer never reaches a "success" screen
so there's nothing to email them, but the team gets a lead they can personally follow up with
instead of a lost sale nobody notices. A payment that's simply started and never finished (browser
closed before Razorpay's widget even opened) stays `created` — visible and filterable in
**Admin → Payments** rather than invisible.

**Refunds** — from **Admin → Payments**, click **Refund** on any paid payment to issue a full or
partial refund. This calls Razorpay's Refunds API directly (never faked locally), updates the
payment's status to `refunded`/`partially_refunded`, and excludes the refunded amount from the
revenue stats on that page. Each row also has a **View in Razorpay** link for manual reconciliation
against Razorpay's own dashboard. Subscribe your webhook (section above) to `refund.processed` too,
not just `payment.captured`, so a refund issued directly from the Razorpay dashboard (bypassing
this admin UI) still gets reflected here automatically.

---

## 4.8. Daily digest email

`/api/cron/daily-digest`, scheduled once a day (9:00am IST) via Vercel Cron in `vercel.json`,
emails the team one summary of the last 24 hours: new enquiries, payments received, revenue, and a
breakdown by program. If nothing happened in that window, it skips sending — no "0 enquiries, 0
payments" noise every morning. Needs `SMTP_*` and Supabase configured (see **4.5**); `CRON_SECRET`
is optional but recommended so the endpoint can't be triggered by anyone who finds the URL.

The same daily run also emails a one-time "still want to enroll?" nudge to anyone whose checkout
has sat unfinished (status `created`) for more than 2 hours — see **4.9** below — and cleans up
stale rows in the `rate_limit_counters` table used by `api/_lib/rateLimit.js`.

---

## 4.9. Coupons

From **Admin → Coupons**, create a code with a percent-off or flat-amount-off discount, optionally
scoped to specific programs, with an optional usage limit and expiry date. At checkout, the coupon
field is optional — if filled in, `api/create-order.js` validates and applies the discount entirely
server-side (`api/_lib/coupons.js`) against the `coupons` table; the browser only ever sends the
*code*, never a discount amount, matching the same never-trust-the-client rule the base tier price
already follows. Applied coupons are recorded on the payment row for reconciliation. Deactivate a
coupon any time from the same page — deactivated/expired/fully-redeemed codes are rejected at
checkout with a clear error, not silently ignored.

---

## 4.10. Batches, Attendance, Assignments & Site Content

Four modules named in CLAUDE.md's original spec, all real now:

- **Batches** (Admin → Batches) — schedule a cohort against a course (start/end date, online/
  offline/hybrid, capacity) and enroll students into it. `batch_availability()` is a
  SECURITY DEFINER function (not a plain view — see the comment in `supabase/018_batches.sql` for
  why) that lets the public marketing site eventually show real seat counts without ever exposing
  who's enrolled.
- **Attendance** (Admin → Attendance) — pick a batch, create a session, mark each enrolled student
  present/late/absent. Both admins and faculty can mark attendance (a deliberate exception to this
  project's usual admin-only write pattern — faculty are the ones actually running the session).
  Students see their own attendance history on their dashboard.
- **Assignments** (Admin → Assignments) — post an assignment against a course with a due date and
  max score; students submit text and/or a link from their dashboard and can resubmit until graded.
  Grading (grade/feedback/status) is staff-only, enforced by a database trigger
  (`prevent_self_grading` in `supabase/020_assignments.sql`) so a student can't set their own grade
  even via a raw API call, not just because the UI doesn't offer the field.
- **Site Content** (Admin → Site Content) — a scoped CMS: edit the FAQ and Testimonials sections as
  JSON, live, without a code change or redeploy. Deliberately narrow — a full page-builder was out
  of scope, and **Pricing is intentionally not editable here**: its tier keys/amounts must stay in
  lockstep with `api/_lib/pricing.js`'s server-side source of truth, so it stays code-only on
  purpose. If no override is saved for a section, the page falls back to the built-in default in
  `src/data/siteData.js` — the marketing site never breaks or shows empty content because of a
  missing CMS row.

---

## 5. Project structure

```
api/
  enquiry.js               ← POST endpoint: validates, stores to Supabase, emails via Titan Mail SMTP
  create-order.js          ← POST endpoint: creates a Razorpay order for a fixed course tier
  verify-payment.js        ← POST endpoint: verifies a Razorpay payment, stores it, emails a receipt
  razorpay-webhook.js      ← POST endpoint: reliability backstop for verify-payment + payment-failed alert
  health.js                ← GET /api/health — confirms what's configured, without leaking secrets
  admin/create-person.js   ← POST endpoint: admin-only, invites a new student/faculty account
  cron/daily-digest.js     ← GET endpoint, called by Vercel Cron: daily enquiries+payments summary email
  _lib/email.js            ← Titan Mail SMTP sender (nodemailer) shared by every endpoint above
  _lib/emailTemplates.js   ← shared HTML email fragments (brand header/footer, row builder)
  _lib/pricing.js          ← authoritative tier→price map, resolved server-side only
supabase/
  schema.sql                ← run once in Supabase's SQL editor: profiles + enquiries tables, RLS
  002_enrich_enquiries.sql  ← run this too if you set up Supabase before this update
  003_people_admin.sql      ← run this too if you set up Supabase before the People admin module
  004_student_self_service.sql ← run this too if you set up Supabase before the student portal
  012_payments.sql          ← run this too if you set up Supabase before Razorpay payments
  013_database_hygiene.sql  ← run this too — index/FK cleanup, certificate tamper-fix, email-change guard
  014_rate_limiting.sql     ← run this too — durable, cross-instance rate limiting (see api/_lib/rateLimit.js)
  015_payment_lifecycle.sql ← run this too — created/failed/refund payment states, refund tracking columns
  016_abandoned_checkout.sql ← run this too — tracks whether an abandoned-checkout nudge was sent
  017_coupons.sql            ← run this too — coupons table + discount tracking on payments
  018_batches.sql            ← run this too — batch/cohort calendar + seat availability
  019_attendance.sql         ← run this too — attendance sessions + records (admin/faculty write)
  020_assignments.sql        ← run this too — assignments + submissions, staff-only grading guard
  021_cms.sql                ← run this too — site_content table (FAQ & Testimonials, admin-editable)
src/
  data/siteData.js       ← almost all editable content lives here
  components/            ← one file per section (Hero, Programs, Pricing, etc.)
  components/admin/       ← ProtectedRoute (auth guard), AdminLayout (shared header + nav)
  pages/                   ← MarketingSite, AdminLogin, AdminDashboard, AdminPeople
  hooks/                 ← scroll-reveal, count-up, and typewriter animation logic
  context/ThemeContext.jsx ← dark mode
  context/AuthContext.jsx  ← session + role, sign in/out
  lib/supabaseClient.js    ← the Supabase browser client
  App.jsx                 ← routes: "/" marketing site, "/admin/login", "/admin/*" (protected, nested)
  index.css               ← design tokens, colors, custom utility classes
tailwind.config.js         ← brand colors/fonts (navy, royal blue, accent blue)
```

## 6. What wasn't included (happy to build next)

As of this update: Enquiries, People, Courses, Batches, Attendance, Assignments, Certificates,
Coupons, Payments (with refunds), Site Content (CMS, scoped to FAQ & Testimonials), Analytics, and
the Student portal (`/student/login` → `/student`, with profile, courses, assignments, attendance,
and certificates) are all real. Still not built: bulk-importing student accounts from a list of
emails, WhatsApp automation via Meta's Cloud API (queued on your business verification), Downloads
(a resource library), in-app Notifications, a general admin Settings page, a careers page, and an
events page. GST-compliant invoicing and automated test coverage are also still open — see the
engineering-audit artifact from your last session for the full prioritized list if you want it.

## 7. Performance note

`src/App.jsx` lazy-loads everything under `/admin` and `/student` — confirmed via a real Vercel
build log that the public marketing site's bundle no longer ships `recharts` (or any admin/student
code) to visitors who never log in. If you add more heavy libraries to the admin or student side
later, keep them behind that same `lazy()` boundary rather than importing them at the top of
`App.jsx`, or they'll leak back into the bundle everyone downloads. `AuthProvider` itself is lazy
too now (see `src/routes/AdminApp.jsx` / `StudentApp.jsx` / `ResetPasswordApp.jsx`) — the Supabase
SDK only loads for someone actually visiting one of those routes, not on the public homepage.

## 8. Security notes

- **No CORS headers on `/api/*` routes — intentional, not an oversight.** The API is same-origin
  only (the frontend and API are served from the same domain) and uses bearer-token auth, not
  cookies, so the browser's default same-origin policy already protects every endpoint. Adding a
  permissive `Access-Control-Allow-Origin: *` later to "fix" a perceived missing header would
  actually weaken this — don't.
- Every public-facing `/api` route rate-limits by IP (`api/_lib/rateLimit.js`). It uses a durable,
  shared counter in Supabase once `supabase/014_rate_limiting.sql` is run (falls back to a
  per-instance in-memory counter otherwise, which is why running that migration matters — see
  section 4.5).
