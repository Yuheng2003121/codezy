# Debug Mode Rules (Non-Obvious Only)

## Server Logs
- Server logs appear in terminal where `npm run dev` is executed
- For CLI tool debugging: run `npx coder-cli <command>` directly

## Database Debugging
- Prisma query logging: add `log: ["query", "info", "warn", "error"]` to Prisma datasource
- Migrations must be run from `server/` directory: `npx prisma migrate dev`

## Next.js Dev Tools
- Use `npm run dev` for hot reload debugging
- Check `.next/` folder for build artifacts (ignored by ESLint)

## better-auth Debugging
- Enable debug mode in auth config: `debug: true`
- Session issues: verify `FRONTEND_URL` env var matches exactly

## TypeScript Errors
- Run `npx tsc --noEmit` to check for type errors without building
- Generated Prisma types in `server/src/generated/prisma`
