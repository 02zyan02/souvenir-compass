import 'dotenv/config'
import express from 'express'
import { Pool } from 'pg'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const port = Number(process.env.PORT || 3001)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

app.get('/api/catalog', async (_request, response, next) => {
  try {
    const [countries, products, checklist, photos, reviews] = await Promise.all([
      pool.query(`SELECT c.*, COUNT(p.id)::int AS find_count
        FROM countries c LEFT JOIN products p ON p.country_id = c.id
        GROUP BY c.id ORDER BY c.name`),
      pool.query(`SELECT p.*, c.name AS country, c.slug AS country_slug
        FROM products p JOIN countries c ON c.id = p.country_id
        ORDER BY c.name, p.name`),
      pool.query('SELECT name FROM shopping_checklist_items WHERE trip_name = $1 ORDER BY position', ['Japan, spring 2027']),
      pool.query('SELECT product_id, image_url, alt_text, position FROM product_photos ORDER BY product_id, position'),
      pool.query('SELECT product_id, reviewer_name, rating, body, created_at FROM product_reviews ORDER BY created_at DESC'),
    ])
    response.json({
      countries: countries.rows,
      products: products.rows.map(product => ({ ...product, photos: photos.rows.filter(photo => photo.product_id === product.id), reviews: reviews.rows.filter(review => review.product_id === product.id) })),
      categories: [...new Set(products.rows.map(({ category }) => category))],
      checklist: checklist.rows.map(({ name }) => name),
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
