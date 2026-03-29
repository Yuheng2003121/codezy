# Ask Mode Rules (Non-Obvious Only)

## Project Context
- This is a full-stack app with Next.js client and Express server
- Authentication uses better-auth (not NextAuth) - different API patterns
- Database is PostgreSQL with Prisma ORM

## Key Directories
- `client/app/` - Next.js app router pages and layouts
- `client/components/ui/` - shadcn/ui components (radix-nova style)
- `client/hooks/` - Custom React hooks (`use-auth`, `use-mobile`)
- `server/src/` - Express server code, routers, and utilities
- `server/prisma/` - Database schema and migrations

## Documentation Locations
- Next.js docs in `node_modules/next/dist/docs/` (for breaking changes)
- Prisma schema: `server/prisma/schema.prisma`
- Auth config: `server/src/lib/auth.ts`

## Database Models
- `User`, `Session`, `Account`, `Verification`, `DeviceCode`
- All tables use lowercase names via `@@map()`
