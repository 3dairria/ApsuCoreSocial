import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for production migrations')
}

export default defineConfig({
  schema: './src/db/schema.pg.ts',
  out: './migrations/pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
