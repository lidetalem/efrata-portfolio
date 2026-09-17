import * as schema from "./schema";

/**
 * Database client.
 *
 * - Production / staging: a real PostgreSQL server (Neon recommended) via `DATABASE_URL`.
 * - Local development without a Postgres server: an embedded PostgreSQL (PGlite, the real
 *   Postgres engine compiled to WASM) stored in `./.pglite`. Same SQL, same schema,
 *   zero setup — so `npm run dev` works immediately after extracting the project.
 *
 * Set `DATABASE_URL` to switch to the hosted database. Nothing else changes.
 */

type DB = import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> &
  { $client?: unknown };

const url = process.env.DATABASE_URL?.trim();
export const usingEmbeddedDatabase = !url || url.startsWith("pglite");

const globalForDb = globalThis as unknown as { __efrataDb?: Promise<DB> };

async function create(): Promise<DB> {
  if (!usingEmbeddedDatabase) {
    const postgres = (await import("postgres")).default;
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const sql = postgres(url!, { max: 5, prepare: false });
    return drizzle(sql, { schema }) as unknown as DB;
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const client = new PGlite(process.env.PGLITE_DIR || "./.pglite");
  const db = drizzle(client, { schema }) as unknown as DB;
  await migrateEmbedded(db);
  return db;
}

let migrated = false;
async function migrateEmbedded(db: DB) {
  if (migrated) return;
  migrated = true;
  const { readFileSync, readdirSync, existsSync } = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "drizzle");
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sqlText = readFileSync(path.join(dir, file), "utf8");
    for (const stmt of sqlText.split("--> statement-breakpoint")) {
      const trimmed = stmt.trim();
      if (!trimmed) continue;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (db as any).execute(trimmed);
      } catch {
        /* already applied */
      }
    }
  }
}

export function getDb(): Promise<DB> {
  if (!globalForDb.__efrataDb) globalForDb.__efrataDb = create();
  return globalForDb.__efrataDb;
}

export { schema };
