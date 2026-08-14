import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the connection URL for CLI commands (db push, migrate,
// studio) here — the schema.prisma datasource block only declares the
// provider now. The app itself connects separately via a driver adapter,
// see src/lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
