# Reality X Nexus 🌐⚡

> Official web platform for **Reality X Nexus** — a tech club — built with React, Supabase, and a production-grade database schema to manage members, events, and club activities.

---

## 🏛️ About

Reality X Nexus is a technology club platform that brings members together around shared interests in emerging tech. This web app serves as the club's digital home — handling member profiles, event listings, announcements, and data-driven club insights.

---

## ✨ Features

- 👥 **Member Management** — Register, view, and manage club members
- 📅 **Events & Activities** — Browse and track upcoming club events
- 📊 **Club Analytics** — Visual dashboards powered by Recharts
- 🔐 **Supabase Auth** — Secure member authentication
- 🗄️ **Database Migrations** — Production-grade schema via PLpgSQL
- ⚡ **Fast Data Fetching** — TanStack Query with caching and revalidation
- 🌗 **Dark / Light Mode** — next-themes toggle
- 📱 **Fully Responsive** — Mobile-first Tailwind CSS design

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Package Manager | Bun |
| Styling | Tailwind CSS |
| Components | shadcn/ui + Radix UI |
| Backend / Auth | Supabase |
| Database | PostgreSQL (via Supabase) |
| Migrations | PLpgSQL |
| Data Fetching | TanStack Query |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |

---

## 🏗️ Architecture

```
React Frontend (Vite)
        │
        ├── React Router DOM  →  Multi-page routing
        ├── TanStack Query    →  Server state & caching
        └── Supabase Client   →  Auth + Database
                │
                ▼
        Supabase (PostgreSQL)
        ├── Authentication    →  Member login / signup
        ├── Database          →  Members, Events, Posts
        └── PLpgSQL Migrations → Version-controlled schema
```

---

## 🗄️ Database

The `supabase/` folder contains version-controlled **PLpgSQL migrations** — the full relational schema for the club platform including tables for members, events, and club data.

```bash
supabase/
└── migrations/   # PostgreSQL migration files
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ or [Bun](https://bun.sh/)
- [Supabase](https://supabase.com/) project

### Installation

```bash
git clone https://github.com/Bala-saran/reality-x-nexus.git
cd reality-x-nexus
bun install
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
bun run dev
```

Open `http://localhost:5173`

### Apply Database Migrations

```bash
# Using Supabase CLI
supabase db push
```

---

## 📁 Project Structure

```
reality-x-nexus/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks (TanStack Query)
│   └── lib/            # Supabase client, utilities
├── supabase/
│   └── migrations/     # PLpgSQL database migrations
├── public/             # Static assets
└── vite.config.ts
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

---

## 👨‍💻 Developer

**Bala-saran** — [@Bala-saran](https://github.com/Bala-saran)

- 🌐 Portfolio: [balasarans-portfolio.netlify.app](https://balasarans-portfolio.netlify.app)
- 💼 LinkedIn: [linkedin.com/in/balasaran-v-380523309](https://linkedin.com/in/balasaran-v-380523309)

---

## 📜 License

Built for Reality X Nexus Club. Open for reference and learning.
