import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

// bundled into dist/ by scripts/build-boot.mjs the statics sit next to the
// bundle; in the repo layout they live in ./dist. Resolve whichever exists.
const HERE = fileURLToPath(new URL('.', import.meta.url))
const ROOT = existsSync(join(HERE, 'dist', 'index.html')) ? join(HERE, 'dist') : HERE
const PORT = process.env.PORT || 3000

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
}

// DATABASE_URL is injected only on the kimi.site runtime; OKC FC publishes
// may have none. Create the pool lazily so the static site still boots and
// only the enquiry API reports the missing backend.
let pool = null
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL)
  await pool.query(`CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(200) NOT NULL,
    intent TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`)
  // leads do diagnóstico de liderança (seção Contato)
  await pool.query(`CREATE TABLE IF NOT EXISTS leads (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tipo CHAR(2) NOT NULL,
    nome VARCHAR(160) NOT NULL,
    responsavel VARCHAR(160) NULL,
    whatsapp VARCHAR(20) NULL,
    email VARCHAR(200) NULL,
    principal VARCHAR(80) NULL,
    intensidade TINYINT UNSIGNED NULL,
    indice TINYINT UNSIGNED NOT NULL,
    faixa VARCHAR(40) NOT NULL,
    respostas TEXT NOT NULL,
    pagina VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`)
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 64 * 1024) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

const sendJson = (res, status, data) => {
  const body = JSON.stringify(data)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(body)
}

const postEnquiry = async (req, res) => {
  if (!pool) {
    sendJson(res, 503, { ok: false, error: 'database not configured' })
    return
  }
  let payload
  try {
    payload = JSON.parse(await readBody(req))
  } catch {
    sendJson(res, 400, { ok: false, error: 'invalid body' })
    return
  }
  const name = String(payload.name || '').trim().slice(0, 120)
  const email = String(payload.email || '').trim().slice(0, 200)
  const intent = String(payload.intent || '').trim().slice(0, 4000)
  if (!name || !intent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(res, 422, { ok: false, error: 'invalid fields' })
    return
  }
  await pool.query('INSERT INTO enquiries (name, email, intent) VALUES (?, ?, ?)', [name, email, intent])
  sendJson(res, 201, { ok: true })
}

const texto = (valor, max) => String(valor ?? '').trim().slice(0, max)
const inteiro = (valor, min, max) => {
  const n = Number(valor)
  return Number.isInteger(n) && n >= min && n <= max ? n : null
}

const postLead = async (req, res) => {
  if (!pool) {
    sendJson(res, 503, { ok: false, error: 'database not configured' })
    return
  }
  let payload
  try {
    payload = JSON.parse(await readBody(req))
  } catch {
    sendJson(res, 400, { ok: false, error: 'invalid body' })
    return
  }
  if (!payload || typeof payload !== 'object') {
    sendJson(res, 400, { ok: false, error: 'invalid body' })
    return
  }

  const tipo = payload.tipo === 'pj' ? 'pj' : payload.tipo === 'pf' ? 'pf' : null
  const nome = texto(payload.nome, 160)
  const responsavel = texto(payload.responsavel, 160) || null
  const whatsapp = texto(payload.whatsapp, 40).replace(/\D/g, '') || null
  const email = texto(payload.email, 200) || null
  const indice = inteiro(payload.indice, 0, 100)
  const faixa = texto(payload.faixa, 40)
  const pagina = texto(payload.pagina, 500) || null

  // respostas: { idDaPergunta: 0..4 } — só guarda o que tem esse formato
  const respostas = {}
  if (payload.respostas && typeof payload.respostas === 'object') {
    for (const [chave, valor] of Object.entries(payload.respostas).slice(0, 20)) {
      const n = inteiro(valor, 0, 4)
      if (/^[a-z0-9-]{1,40}$/i.test(chave) && n !== null) respostas[chave] = n
    }
  }
  const principal = payload.principal && typeof payload.principal === 'object' ? payload.principal : null

  const contatoOk =
    (whatsapp && whatsapp.length >= 10 && whatsapp.length <= 13) ||
    (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  if (!tipo || nome.length < 2 || !contatoOk || indice === null || !faixa || !Object.keys(respostas).length) {
    sendJson(res, 422, { ok: false, error: 'invalid fields' })
    return
  }
  if (whatsapp && (whatsapp.length < 10 || whatsapp.length > 13)) {
    sendJson(res, 422, { ok: false, error: 'invalid fields' })
    return
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sendJson(res, 422, { ok: false, error: 'invalid fields' })
    return
  }

  await pool.query(
    `INSERT INTO leads (tipo, nome, responsavel, whatsapp, email, principal, intensidade, indice, faixa, respostas, pagina)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tipo,
      nome,
      responsavel,
      whatsapp,
      email,
      principal ? texto(principal.area, 80) || null : null,
      principal ? inteiro(principal.intensidade, 0, 100) : null,
      indice,
      faixa,
      JSON.stringify(respostas),
      pagina
    ]
  )
  sendJson(res, 201, { ok: true })
}

const serveStatic = async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let path = normalize(decodeURIComponent(url.pathname))
  if (path.includes('..')) {
    res.writeHead(403).end()
    return
  }
  if (path === '/' || path === '\\') path = '/index.html'
  let file = join(ROOT, path)
  try {
    const info = await stat(file)
    if (info.isDirectory()) file = join(file, 'index.html')
  } catch {
    // 哈希路由：未知路径回到应用入口
    file = join(ROOT, 'index.html')
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
}

createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname
    if (req.method === 'POST' && pathname === '/api/enquiries') {
      await postEnquiry(req, res)
      return
    }
    if (req.method === 'POST' && pathname === '/api/leads') {
      await postLead(req, res)
      return
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      await serveStatic(req, res)
      return
    }
    res.writeHead(405).end()
  } catch (error) {
    sendJson(res, 500, { ok: false, error: 'server error' })
  }
}).listen(PORT, () => {
  console.log(`forbrains listening on ${PORT}`)
})
