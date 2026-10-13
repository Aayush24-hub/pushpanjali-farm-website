// Applies db/schema.sql to the database in DATABASE_URL. Idempotent.
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const sql = await readFile(fileURLToPath(new URL('../db/schema.sql', import.meta.url)), 'utf8')
const client = new pg.Client({ connectionString: url })
try {
  await client.connect()
  await client.query(sql)
  console.log('Database schema is up to date.')
} catch (e) {
  console.error('Database setup failed:', e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
