import { randomBytes } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'

const envPath = fileURLToPath(new URL('../.env.local', import.meta.url))
try {
  process.loadEnvFile(envPath)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
if (!clientId || !clientSecret) {
  console.error('Preencha SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET em .env.local primeiro.')
  process.exit(1)
}

const redirectUri = 'http://127.0.0.1:4381/callback'
const state = randomBytes(24).toString('hex')
const authorize = new URL('https://accounts.spotify.com/authorize')
authorize.search = new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: redirectUri,
  scope: 'user-read-currently-playing user-read-recently-played',
  state,
}).toString()

let processing = false
let timeout
const server = createServer(async (request, response) => {
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  const url = new URL(request.url, redirectUri)
  if (request.method !== 'GET' || url.pathname !== '/callback') {
    response.writeHead(404).end('Página não encontrada.')
    return
  }
  if (url.searchParams.get('state') !== state) {
    response.writeHead(400).end('Esta autorização não corresponde à sessão atual. Use o link do terminal.')
    return
  }
  if (processing) {
    response.writeHead(409).end('Autorização em andamento. Consulte o terminal.')
    return
  }
  processing = true
  try {
    const code = url.searchParams.get('code')
    if (!code || url.searchParams.has('error')) throw new Error('A autorização não foi concluída.')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!tokenResponse.ok) throw new Error(`O Spotify não concluiu a troca do token (HTTP ${tokenResponse.status}). Confira as credenciais e a Redirect URI.`)
    const token = await tokenResponse.json()
    if (typeof token.refresh_token !== 'string' || !token.refresh_token || /[\r\n]/.test(token.refresh_token)) {
      throw new Error('O Spotify não retornou um refresh token válido.')
    }
    const existing = await readFile(envPath, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return ''
      throw error
    })
    const setting = `SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`
    const updated = /^\s*SPOTIFY_REFRESH_TOKEN\s*=/m.test(existing)
      ? existing.replace(/^\s*SPOTIFY_REFRESH_TOKEN\s*=.*$/m, () => setting)
      : `${existing.trimEnd()}\n${setting}\n`
    await writeFile(envPath, updated, { mode: 0o600 })
    console.log('Spotify conectado. SPOTIFY_REFRESH_TOKEN foi salvo em .env.local. Reinicie o servidor de desenvolvimento.')
    response.end('Spotify conectado! O token foi salvo em .env.local. Você pode fechar esta aba e reiniciar o servidor de desenvolvimento.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
    response.writeHead(400).end('Não foi possível concluir a conexão. Consulte o terminal e execute pnpm spotify:auth novamente.')
  } finally {
    clearTimeout(timeout)
    server.close()
  }
})

server.on('error', (error) => {
  console.error(`Não foi possível iniciar a autorização na porta 4381: ${error.code}.`)
  process.exitCode = 1
  clearTimeout(timeout)
})
server.listen(4381, '127.0.0.1', () => {
  console.log(`Cadastre esta Redirect URI no app do Spotify: ${redirectUri}`)
  console.log(`Abra este link e autorize sua conta:\n${authorize}`)
  timeout = setTimeout(() => {
    console.error('A autorização expirou. Execute pnpm spotify:auth novamente.')
    process.exitCode = 1
    server.close()
  }, 300_000)
})
