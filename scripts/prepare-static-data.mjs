import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'data')
const destination = path.join(root, 'public', 'data')
const files = (await readdir(source)).filter(file => /^catalog-(?:index|[a-z-]+)\.json$/.test(file))

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await Promise.all(files.map(file => cp(path.join(source, file), path.join(destination, file))))

const indexPath = path.join(destination, 'catalog-index.json')
const index = JSON.parse(await readFile(indexPath, 'utf8'))
const travelSpotFiles = (await readdir(source)).filter(file => /^travel-spots-[a-z-]+\.json$/.test(file))
const travelSpots = (await Promise.all(travelSpotFiles.map(async file => {
  const data = JSON.parse(await readFile(path.join(source, file), 'utf8'))
  return data.spots
}))).flat()
index.travelSpots = travelSpots
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`)
