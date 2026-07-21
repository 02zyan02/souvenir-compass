import 'dotenv/config'
import express from 'express'
import { Pool } from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, readdirSync } from 'node:fs'

const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const port = Number(process.env.PORT || 3001)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const countryData = JSON.parse(readFileSync(path.join(root, 'data', 'country.json'), 'utf8'))
const travelSpots = readdirSync(path.join(root, 'data'))
  .filter(file => /^travel-spots-[a-z-]+\.json$/.test(file))
  .flatMap(file => JSON.parse(readFileSync(path.join(root, 'data', file), 'utf8')).spots)

app.use('/api', (request, response, next) => {
  const origin = request.headers.origin
  const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)

  if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (request.method === 'OPTIONS') return response.sendStatus(204)
  next()
})

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.get('/api/catalog', async (_request, response, next) => {
  try {
    const [countries, products, checklist, photos, reviews, exchangeRates] = await Promise.all([
      pool.query(`SELECT c.*, COUNT(p.id)::int AS find_count
        FROM countries c LEFT JOIN products p ON p.country_id = c.id
        GROUP BY c.id ORDER BY c.name`),
      pool.query(`SELECT p.*, c.name AS country, c.slug AS country_slug
        FROM products p JOIN countries c ON c.id = p.country_id
        ORDER BY c.name, p.name`),
      pool.query('SELECT name FROM shopping_checklist_items WHERE trip_name = $1 ORDER BY position', ['Japan, spring 2027']),
      pool.query('SELECT product_id, image_url, alt_text, position FROM product_photos ORDER BY product_id, position'),
      pool.query('SELECT product_id, reviewer_name, rating, body, created_at FROM product_reviews ORDER BY created_at DESC'),
      pool.query('SELECT currency_code, rate_per_eur, as_of_date, source_name, source_url FROM exchange_rates ORDER BY currency_code'),
    ])
    response.json({
      countries: countries.rows,
      products: products.rows.map(product => ({ ...product, photos: photos.rows.filter(photo => photo.product_id === product.id), reviews: reviews.rows.filter(review => review.product_id === product.id) })),
      categories: [...new Set(products.rows.map(({ category }) => category))],
      checklist: checklist.rows.map(({ name }) => name),
      exchangeRates: exchangeRates.rows,
      customsInformation: countryData.customsInformation,
      travelSpots,
    })
  } catch (error) { next(error) }
})

app.use(express.static(path.join(root, 'dist')))
app.get(/.*/, (_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')))
app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Unable to load catalog data.' })
})

app.listen(port, () => console.log(`Souvenir Compass API listening on port ${port}`))
