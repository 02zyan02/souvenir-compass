import 'dotenv/config'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to export the existing catalogue.')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDirectory = path.join(root, 'data')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

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
  const travelSpots = (await Promise.all(
    (await readdir(dataDirectory))
      .filter(file => /^travel-spots-[a-z-]+\.json$/.test(file))
      .map(async file => JSON.parse(await readFile(path.join(dataDirectory, file), 'utf8')).spots),
  )).flat()
  const customsInformation = JSON.parse(await readFile(path.join(dataDirectory, 'country.json'), 'utf8')).customsInformation
  const catalogFiles = countries.rows.map(country => `catalog-${country.slug}.json`)

  await mkdir(dataDirectory, { recursive: true })
  await Promise.all(countries.rows.map(async country => {
    const countryProducts = products.rows
      .filter(product => product.country_id === country.id)
      .map(product => ({
        ...product,
        photos: photos.rows.filter(photo => photo.product_id === product.id),
        reviews: reviews.rows.filter(review => review.product_id === product.id),
      }))
    await writeFile(
      path.join(dataDirectory, `catalog-${country.slug}.json`),
      `${JSON.stringify({ country, products: countryProducts }, null, 2)}\n`,
    )
  }))
  await writeFile(path.join(dataDirectory, 'catalog-index.json'), `${JSON.stringify({
    countries: countries.rows,
    catalogFiles,
    categories: [...new Set(products.rows.map(({ category }) => category))],
    checklist: checklist.rows.map(({ name }) => name),
    exchangeRates: exchangeRates.rows,
    customsInformation,
    travelSpots,
  }, null, 2)}\n`)
  console.log(`Exported ${countries.rowCount} country catalogues to ${dataDirectory}`)
} finally {
  await pool.end()
}
