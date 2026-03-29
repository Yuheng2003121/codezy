# Code Mode Rules (Non-Obvious Only)

## shadcn/ui Components
- Components use `radix-nova` style (not default) - check `components.json`
- Use [`cn()`](client/lib/utils.ts:4) utility for class merging: `cn("base", className)`
- All UI components located in `@/components/ui`

## Path Aliases
- `@/*` maps to project root - use `@/components/...`, `@/lib/...`, `@/hooks/...`

## Prisma Generated Code
- Prisma client outputs to `server/src/generated/prisma` (not `node_modules/.prisma`)
- Always regenerate after schema changes: `npx prisma generate`

## better-auth Integration
- Auth routes handled automatically at `/api/auth/*`
- Session retrieval: `auth.api.getSession({ headers })`
- Client auth library: `better-auth/client`

## TypeScript Config
- `moduleResolution: "bundler"` - modern resolution strategy
- `jsx: "react-jsx"` - React 19 automatic JSX runtime
