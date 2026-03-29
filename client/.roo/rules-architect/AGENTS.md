# Architect Mode Rules (Non-Obvious Only)

## Architecture Constraints
- **Client-Server Separation**: Client (Next.js) and Server (Express) are independent apps
- **CORS**: Server configured to accept requests from `FRONTEND_URL` env var only
- **Auth Flow**: better-auth handles sessions via HTTP-only cookies

## Component Coupling
- Client hooks (`use-auth`) depend on `better-auth/client` library
- Server routers import from `server/src/lib/auth.ts` for auth instance
- Prisma client is shared across all server modules

## Database Migration Notes
- Migrations are forward-only (Prisma default behavior)
- Schema changes require: `npx prisma migrate dev` then `npx prisma generate`
- Generated types in `server/src/generated/prisma` must be committed

## CLI Tool Architecture
- Entry point: `tsx ./src/cli/main.ts` (defined in package.json bin)
- Uses `@clack/prompts` for CLI UI
- Commands organized in `server/src/cli/commands/`

## API Endpoints
- `/api/auth/*` - better-auth endpoints (auto-generated)
- `/api/me` - Session check endpoint
- `/device` - Device code router (custom)

## Error Handling Pattern
- Custom `NotFoundError` for 404s
- Global error handler middleware in `server/src/middleware/errorHandler.ts`
- Must be registered after all routes
