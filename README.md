# וְאַנְוֵהוּ — Arba Minim webshop

A full production build of the וְאַנְוֵהוּ (Vaanvehu) Arba Minim store: public website + mobile-responsive
storefront, and a separate admin ("בקרה ושליטה") back office. Built from the design handoff in
`design_handoff_vaanvehu/` (not included in this repo — see that bundle's `README.md` for the full
visual/behavioral spec this implementation follows).

- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, Postgres + Prisma, RTL-first,
  Hebrew / English / French.
- **No payment gateway.** The customer picks bit / PayBox / credit card and that choice is stored on
  the order — no card data is collected or processed (see "Production notes" below).

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL 14+ server (local or remote)

## 2. Setup

```bash
npm install
cp .env.example .env      # then edit DATABASE_URL / ADMIN_PASSWORD below
```

Edit `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/vaanvehu?schema=public"
ADMIN_PASSWORD="choose-a-password"        # admin login (see "Admin auth" below)
NEXT_PUBLIC_DEFAULT_WHATSAPP="052-6665954"  # only used as a seed default; live value is Settings.whatsappNumber
```

If you don't have Postgres running yet, the quickest local option:

```bash
# Debian/Ubuntu example
sudo pg_ctlcluster <version> main start
sudo -u postgres psql -c "CREATE USER vaanvehu WITH PASSWORD 'vaanvehu' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE vaanvehu OWNER vaanvehu;"
```

Then create the schema and seed the catalog (sets, Etrog types/grades, lulavim, hadassim, aravot,
pickup points, delivery cities/neighborhoods, message templates, and a handful of demo orders so the
admin dashboard isn't empty on first run):

```bash
npx prisma migrate dev --name init   # first time only — creates the schema
npm run db:seed                      # (re-)loads the catalog/settings data; safe to re-run
```

## 3. Run it

```bash
npm run dev
```

- **Storefront**: http://localhost:3000
- **Admin**: http://localhost:3000/admin — you'll be redirected to `/admin/login`.
  Password = the `ADMIN_PASSWORD` env var (defaults to `vaanvehu` if unset — change this before any
  real deployment).

For a production build: `npm run build && npm run start`.

## 4. What's implemented

**Storefront** (`app/(shop)/…`): language gate → home → Complete Sets (list + detail) or Build Your
Own Set (Etrog type → grade, Lulavim, Hadassim, Aravot & accessories) → Pitam dialog on every set/Etrog
add (skipped for Teimani) → cart → customer details → pickup point or delivery address → summary →
payment method → confirmation with an order number (`VN-XXXXX`). A floating WhatsApp button (reading
the number from admin Settings) is present on every storefront screen. Layout is desktop (≥1000px, per
`Vaanvehu Desktop.dc.html`) down to mobile-app style (<720px, per `Vaanvehu App.dc.html`), with a
collapsed single-column layout in between, per the handoff's responsive notes.

**Admin** (`app/admin/…`): password-gated (`AdminSession` cookie/DB, 12h TTL) — dashboard with stat
tiles and recent orders, order list with filters/search, single order screen (status buttons, payment
toggle, WhatsApp/email deep links built from the message templates in Settings, internal note),
deliveries grouped by city → neighborhood, catalog (edit name/price/active/image for sets, Etrog types,
grades, and flat products, plus per-set upgrades), customers (derived from orders), and settings
(business email, WhatsApp number, delivery cities + neighborhoods, pickup points, message templates,
auto-send toggle).

Orders are persisted in Postgres via Prisma (`prisma/schema.prisma`). Status changes and the
WhatsApp/email action buttons in admin open `whatsapp://send?...` and `mailto:...` links exactly as in
the design — no WhatsApp/SendGrid API integration (see the handoff README's "Messaging model" and
"Production notes" for what a real deployment should add).

## 5. Project layout

```
app/(shop)/…              storefront routes (language/cart/checkout are client-state, catalog data is
                           fetched server-side per request so admin edits show up immediately)
app/admin/login            admin PIN screen (public)
app/admin/(protected)/…    dashboard / orders / deliveries / catalog / customers / settings
app/api/orders             POST — creates an order from the client-side cart + checkout state
app/api/admin/…            admin-authenticated routes used by the admin screens above
contexts/                  LangContext, CartContext, CheckoutContext (client, localStorage-backed)
lib/                       i18n dictionary, catalog/admin data helpers, cart key logic, wa/mailto builders
prisma/schema.prisma       full data model (catalog, fulfillment, orders, settings, message templates)
prisma/seed.ts             the exact catalog/pickup/delivery-city data captured from the design files
public/assets/             the design's product photography and composite artwork, served as-is
```

## 6. Production notes (not implemented — see the handoff README for detail)

- **Payments**: wire an Israeli gateway (Cardcom / Tranzila / PayPlus / Meshulam) in a hosted
  page/iframe; the app should never touch card data. Keep an idempotent order → payment-intent →
  webhook flow.
- **Messaging**: WhatsApp/email currently rely on the device's own apps opening deep links. A real
  deployment that needs server-side sending should add the WhatsApp Business Cloud API and a
  transactional mail provider, and use the existing `MessageLog` table to record what was actually
  sent (a per-order log entry is already written on every admin-triggered send). The
  `Settings.autoSend` toggle is stored but not yet wired to an automatic sender.
- **Admin auth**: currently a single shared password (`ADMIN_PASSWORD`) behind a signed session
  cookie/DB row — replace with real per-user accounts, 2FA, and roles before going live.
- **Security/legal**: HTTPS, rate limiting, encrypted backups, an admin action log, and the
  accessibility/terms/privacy/cancellation policy pages (currently placeholder links in the footer)
  should all be added per the handoff README before launch.
