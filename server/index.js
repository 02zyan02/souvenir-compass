import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT || 3001)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.use(express.static(path.join(root, 'dist')))
app.get(/.*/, (_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')))

app.listen(port, () => console.log(`Souvenir Compass static server listening on port ${port}`))
