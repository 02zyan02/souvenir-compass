import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to run database migrations.')
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDirectory = path.join(root, 'database')
const migrations = (await readdir(migrationsDirectory))
  .filter(file => /^\d+_.+\.sql$/.test(file))
  .sort()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`)

  for (const filename of migrations) {
    const applied = await client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [filename])
    if (applied.rowCount) continue

    const sql = await readFile(path.join(migrationsDirectory, filename), 'utf8')
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename])
      await client.query('COMMIT')
      console.log(`Applied ${filename}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }
} finally {
  client.release()
  await pool.end()
}
