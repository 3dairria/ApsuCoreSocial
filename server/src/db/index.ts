import BetterSqlite from 'better-sqlite3'
import { drizzle as sqliteDrizzle } from 'drizzle-orm/better-sqlite3'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import * as schema from './schema.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function createDb() {
  const DATABASE_URL = process.env.DATABASE_URL

  if (DATABASE_URL) {
    const pg = (await import('pg')).default
    const { drizzle: pgDrizzle } = await import('drizzle-orm/node-postgres')
    const pgSchema = await import('./schema.pg.js')

    const pool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    })

    pool.on('error', (err) => console.error('[DB] Unexpected pool error:', err.message))

    console.log('[DB] Connected to PostgreSQL')
    // Cast to SQLite type — identical table structure, same Drizzle query API at runtime
    return pgDrizzle(pool, { schema: pgSchema }) as unknown as ReturnType<typeof sqliteDrizzle<typeof schema>>
  }

  const dbPath = join(__dirname, '../../apsucore.db')
  const sqlite = new BetterSqlite(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  console.log('[DB] Connected to SQLite:', dbPath)
  return sqliteDrizzle(sqlite, { schema })
}

export const db = await createDb()
export type DB = typeof db
