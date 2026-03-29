# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure
- **Client**: Next.js 16.2.1 (breaking changes from standard Next.js) + React 19 + Tailwind CSS 4 + shadcn/ui (radix-nova style)
- **Server**: Express 5 + Prisma 7.5.0 + better-auth 1.5.6 + TypeScript
- **Path alias**: `@/*` maps to project root in client

## Commands
**Client** (run from `client/`):
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (core-web-vitals + typescript)

**Server** (run from `server/`):
- `npm run dev` - Start dev server with nodemon + tsx
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled JS
- `npx create-db` - Create and migrate database

## Code Style
- ESLint: `eslint-config-next/core-web-vitals` + TypeScript rules
- shadcn/ui components use `radix-nova` style with `neutral` base color
- Utility function: [`cn()`](client/lib/utils.ts:4) from `clsx` + `tailwind-merge`
- All Prisma models use `@@map()` for lowercase table names

## Architecture Notes
- Prisma client generated to `server/src/generated/prisma` (not default)
- better-auth handles all auth via `/api/auth/*` endpoints
- Server uses custom error handling middleware with `NotFoundError`
- CLI tool entry: `tsx ./src/cli/main.ts` (defined in package.json bin)

## Testing
- No test framework configured yet
