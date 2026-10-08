import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const nextRequire = createRequire(require.resolve('next/package.json'))
const sharp = nextRequire('sharp')
const directory = path.resolve('public')
const logo = await readFile(path.join(directory, 'logo.svg'), 'utf8')
const symbol = logo.match(/<symbol id="logo-mark" viewBox="([^"]+)">([\s\S]+?)<\/symbol>/)
if (!symbol) throw new Error('The vector logo must contain the logo-mark symbol')
const paths = symbol[2].replace(/var\(--brand-accent,\s*#[a-f0-9]+\)/gi, '#bef264')
const image = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#111210"/><svg x="20" y="88" width="216" height="80" viewBox="${symbol[1]}" color="#e7e5e4">${paths}</svg></svg>`)
const sizes = [16, 32, 48, 64, 128, 256]
const pngs = await Promise.all(sizes.map((size) => sharp(image).resize(size, size).png().toBuffer()))
const header = Buffer.alloc(6 + sizes.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((size, index) => {
  const entry = 6 + index * 16
  header[entry] = size === 256 ? 0 : size
  header[entry + 1] = size === 256 ? 0 : size
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(pngs[index].length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += pngs[index].length
})
const ico = Buffer.concat([header, ...pngs])
await Promise.all([
  writeFile(path.join(directory, 'logo.ico'), ico),
  writeFile(path.join(directory, 'favicon.ico'), ico),
  writeFile(path.join(directory, 'icon.png'), pngs[5]),
  sharp(image).resize(180, 180).png().toFile(path.join(directory, 'apple-icon.png')),
])
console.log('Generated logo.ico, favicon.ico, icon.png and apple-icon.png from logo.svg')
