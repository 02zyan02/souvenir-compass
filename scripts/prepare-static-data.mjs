import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'data')
const destination = path.join(root, 'public', 'data')
const files = (await readdir(source)).filter(file => /^catalog-(?:index|[a-z-]+)\.json$/.test(file))

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await Promise.all(files.map(file => cp(path.join(source, file), path.join(destination, file))))
