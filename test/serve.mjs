/**
 * Minimal static server for the offline harness (test/index.html).
 * Serves the plugin directory on 127.0.0.1 so the harness can be opened in a
 * browser: file:// URLs are blocked for page loads.
 *
 *   node test/serve.mjs [port]
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.argv[2] ?? 8791)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://127.0.0.1:${PORT}`)
  const rel = decodeURIComponent(url.pathname === '/' ? '/test/index.html' : url.pathname)
  const file = path.join(ROOT, rel)
  if (!file.startsWith(ROOT)) {
    response.writeHead(403).end('forbidden')
    return
  }
  fs.readFile(file, (error, data) => {
    if (error !== null) {
      response.writeHead(404, { 'content-type': 'text/plain' }).end('not found: ' + rel)
      return
    }
    response.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    response.end(data)
  })
}).listen(PORT, '127.0.0.1', () => {
  console.log(`talk-pages harness: http://127.0.0.1:${PORT}/test/index.html`)
})
