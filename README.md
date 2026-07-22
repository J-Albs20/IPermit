# iPermit SC — Admin (Vite + React + Tailwind)

A web port of the iPermit SC admin system, matching the full "Admin" flow:
Sign In → Dashboard → Create application → Incoming approval queues →
Transactions/Logbook, plus Establishments, Permits, Health Cards, Inspections,
GIS Map, Notifications, and Settings. Built with plain React + Tailwind CSS +
`react-router-dom`, icons from `lucide-react`. No React Native, no Expo — this
is a normal web app.

## Directory structure

```
ipermit-admin-web/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ src/
   ├─ main.jsx                    ← React root: <BrowserRouter> → <AuthProvider> → <DataProvider> → <App>
   ├─ App.jsx                     ← route table (see below)
   ├─ index.css                   ← Tailwind directives + Leaflet CSS import
   ├─ context/
   │  ├─ AuthContext.jsx           ← sign in / sign out / isAuthenticated (demo credentials, see below)
   │  └─ DataContext.jsx           ← single shared store for establishments, permits, health cards,
   │                                 and the logbook — every screen reads/writes through this,
   │                                 so Create/Incoming/Transactions/Permits/HealthCards all stay in sync
   ├─ data/
   │  ├─ seed.js                   ← initial establishments + permits + option lists
   │  └─ healthCards.js            ← initial health cards + compliance helper functions
   ├─ components/
   │  ├─ AdminShell.jsx            ← page shell: sidebar + top bar + responsive drawer
   │  ├─ Sidebar.jsx                ← nav + sign-out button
   │  ├─ TopBar.jsx                 ← search, notifications, theme toggle, action button
   │  ├─ StatCard.jsx, Badge.jsx, Toggle.jsx, Modal.jsx, Toast.jsx
   │  ├─ ProtectedRoute.jsx         ← redirects to /login if not signed in
   │  └─ Icon.jsx                   ← wraps lucide-react, maps semantic names → icons
   └─ admin/
      ├─ Login.jsx                 ← "/login" — sign in form (public route)
      ├─ Dashboard.jsx             ← "/"
      ├─ Establishments.jsx        ← "/establishments"
      ├─ Permits.jsx               ← "/permits" — also exports StatusPill/CategoryPill/HealthCardPill,
      │                              reused by Incoming Permits and Transactions
      ├─ HealthCards.jsx           ← "/health-cards" — also exports StatusPill, reused by Transactions
      ├─ Create.jsx                ← "/create" — 3-step wizard (see below)
      ├─ IncomingSanitaryPermits.jsx ← "/incoming-sanitary-permits" — approval queue
      ├─ IncomingHealthCards.jsx   ← "/incoming-health-cards" — confirmation queue
      ├─ Transactions.jsx          ← "/transactions" — Sanitary Permit / Health Certificate / Logbook tabs
      ├─ Inspections.jsx           ← "/inspections"
      ├─ GisMap.jsx                ← "/gis-map"
      ├─ Notifications.jsx         ← "/notifications"
      └─ Settings.jsx              ← "/settings"
```

## Setup

```bash
cd ipermit-admin-web
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Signing in

The app is gated behind a login screen (`/login`). Demo credentials:

```
Email:    admin@sancarloscho.gov.ph
Password: admin123
```

This is a hardcoded check in `AuthContext.jsx` — swap `signIn()` for a real API
call when you have a backend. Auth state lives in memory only (not persisted
to localStorage), so refreshing the page signs you out again; that's a
5-minute change in `AuthContext.jsx` if you want it to persist.

## The end-to-end flow

1. **Sign In** — `/login`. Wrong credentials show an inline error and keep you
   on the form (matches the flowchart's `Successful? → No → Error → Sign in` loop).
2. **Create** — `/create`. Pick a certificate type (Sanitary Permit, Sanitary
   Permit (Business), or Health Certificate), enter the establishment/holder
   name, and — for Business permits only — classify Food / Non-Food. Submitting
   adds a `Pending` / `Pending Confirmation` record and drops you into the
   matching Incoming queue.
3. **Incoming Sanitary Permit** / **Incoming Health Card** — dedicated approval
   inboxes. Approve/Confirm or Reject each application. Approving a permit
   runs the same health-card compliance check described below.
4. **Transactions** — three tabs:
   - *Sanitary Permit*: Renew (only when `Expiring`), View, Delete
   - *Health Certificate*: View, Delete
   - *Logbook*: a read-only, filterable audit trail of every action taken
     across the app (issued, approved, renewed, confirmed, rejected, deleted)
5. Everything above reads and writes the same `DataContext` store, so an
   approval made in the Incoming queue immediately shows up in Permits,
   Transactions, and the Logbook — no separate copies of the data anymore.

## Health card compliance rule

- **Business** sanitary permits require every employee health card on file
  for that establishment to be `Valid`.
- **Personal** sanitary permits require the holder's own health card to be `Valid`.
- Approving a `Pending` permit or renewing an `Expiring` one runs this check
  automatically (`DataContext.approvePermit` / `renewPermit`). If it fails, a
  toast explains exactly what's missing and the permit is left unchanged.

Try it: **Jollibee San Carlos** (fully compliant) approves/renews cleanly;
**Sunshine Eatery** and **Pala Sizzler** (an expired / a still-pending
employee card) get blocked with an explanatory toast.

## GIS Map

Built with `react-leaflet` + OpenStreetMap tiles (free, no API key). All
establishment/barangay coordinates in `GisMap.jsx` are **placeholders** —
swap in geocoded addresses and real barangay boundary GeoJSON for production
use (see comments in that file).
