# AI Newsletter

Turn RSS feeds into ready to send newsletters with AI.

Connect your feeds, pick a date range, and get titles, subject lines, body content, and top announcements you can drop into Mailchimp, ConvertKit, Substack, or similar tools.

## Features

- **RSS feed management** — add feeds, fetch articles, and keep them organized per user
- **AI newsletter generation** — streams structured output (5 titles, 5 subject lines, body, top 5 announcements)
- **Custom date ranges** — generate for a week, month, or any range you choose
- **Tone & branding settings** — audience, brand voice, company info, footer, and more guide the prompt
- **Newsletter history** — Pro users can save past generations and revisit them later
- **Copy-ready output** — formatted content meant for email platforms, not a custom editor
- **Auth & billing** — Clerk handles sign-in, protected dashboard routes, and subscription plans

## Nores
-Articles are deduplicated by RSS guid so the same item isn’t stored repeatedly across feeds.
-Generation can take a while on larger date ranges. The stream route allows a longer Vercel function duration for that.
-Starter vs Pro limits (feed count, history) are enforced via Clerk plan checks in the app.


## How it works

1. Connect one or more RSS feeds
2. Choose a timeframe and optionally add context for the AI
3. Generate. Articles are refreshed/filtered, a prompt is built from your settings + articles, and GPT-4o streams a structured newsletter back

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Auth / billing | Clerk |
| Database | MongoDB + Prisma |
| AI | Vercel AI SDK `streamObject` + OpenAI `gpt-4o` |
| RSS | `rss-parser` |
| UI | Tailwind CSS, shadcn/ui, Radix |
| Validation | Zod |
| Tooling | pnpm, Biome |
