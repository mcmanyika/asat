# ASAT Technologies Website

Premium informational corporate website for ASAT Technologies.

**Tagline:** Integrated Technology. Intelligent Business.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Lucide React
- Framer Motion
- React Hook Form + Zod
- OpenAI chat assistant
- Supabase (enquiry database)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

## Configuration

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.
2. Add `OPENAI_API_KEY` to enable the floating website chat assistant (optional `OPENAI_CHAT_MODEL`, default `gpt-4o-mini`).
3. Add Supabase keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, recommended)
4. Run `supabase/schema.sql` in the Supabase SQL Editor to create the `enquiries` table and RLS policies.
5. Add verified contact and social details in `src/config/site.ts`.

Empty contact and social fields are hidden automatically. WhatsApp is hidden until a number is configured.

## Phase status

See `DEVELOPMENT_PLAN.md` and `PROJECT_STATUS.md`.

Public website is implemented. Configure Supabase and OpenAI in `.env.local` to enable enquiry storage and chat.
