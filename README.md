# E-Commerce Nothing Phone

A Nothing-brand e-commerce store built with [Next.js](https://nextjs.org) — a React framework that provides file-based routing, React Server Components, server actions, and API routes out of the box. Next.js was chosen for its hybrid rendering model (server-side by default, with client islands where needed), built-in image and font optimization, and its ability to serve as both the frontend and a lightweight API layer, eliminating the need for a separate backend server for this project's scope.

## Tech Stack

- **Framework:** Next.js 16 (canary)
- **Language:** TypeScript
- **Database:** SQLite via `better-sqlite3`
- **ORM:** Drizzle ORM with Drizzle Kit
- **Auth:** Session-based with bcryptjs
- **Styling:** Tailwind CSS v4

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3+ recommended) — the project uses Bun as its package manager.

### Setup

```bash
# Install dependencies
bun install

# Copy environment variables (defaults are fine for local dev)
cp .env.example .env   # if .env doesn't exist
```

### Database

```bash
# Generate and apply migrations
bun db:generate
bun db:migrate

# Seed the database with products
bun db:seed

# (Optional) Open Drizzle Studio to browse data
bun db:studio
```

### Run

```bash
# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Available accounts after seeding (if you created a user via the register flow), or you can browse as a guest.

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun dev`         | Start the Next.js dev server             |
| `bun build`       | Build for production                     |
| `bun start`       | Start the production server              |
| `bun lint`        | Run ESLint                               |
| `bun db:generate` | Generate Drizzle migrations from schema  |
| `bun db:push`     | Push schema to database directly         |
| `bun db:migrate`  | Apply pending migrations                 |
| `bun db:seed`     | Seed the database with product data      |
| `bun db:studio`   | Open Drizzle Studio (GUI database viewer)|

## Project Structure

```
app/               # Next.js App Router pages and API routes
lib/               # Shared utilities
├── auth.ts        # Session auth helpers
├── cart.ts        # Cart logic
├── cart-utils.ts  # Cart utility functions
├── db/            # Database layer
│   ├── index.ts   # DB client
│   ├── schema.ts  # Drizzle schema definitions
│   ├── seed.ts    # Product seed data
│   └── migrate.ts # Migration runner
└── products.ts    # Product queries
```

## Seeding

The seed script populates products and variants for Nothing devices:

- **Phones:** Phone (4a), Phone (4a) Pro, Phone (3)
- **Earbuds:** Ear (3)
- **Headphones:** Headphone (a), Headphone (1)

Each product includes variants by color, storage, and RAM configuration. Run `bun db:seed` to reset and re-seed.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Next.js Agent Docs](https://nextjs.org/docs) (local: `node_modules/next/dist/docs/`)
- [ExplainX Drizzle Skill](https://explainx.ai/skills/lobehub/lobehub/drizzle)
- [Nothing Design Skill](https://github.com/dominikmartn/nothing-design-skill)
