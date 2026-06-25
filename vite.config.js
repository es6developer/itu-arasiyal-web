import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function corsProxy() {
  return {
    name: 'cors-proxy',
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        const fullUrl = new URL(req.url, `http://${req.headers.host}`)
        const targetUrl = fullUrl.searchParams.get('url')

        console.log('[proxy]', targetUrl)

        if (!targetUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing url parameter' }))
          return
        }

        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 15000)

          const response = await fetch(targetUrl, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            },
          })

          clearTimeout(timeout)

          if (!response.ok) {
            console.log('[proxy] upstream error', response.status, targetUrl)
            res.writeHead(response.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: `Upstream returned ${response.status}` }))
            return
          }

          const data = await response.text()
          console.log('[proxy] ok', targetUrl, data.length, 'bytes')

          res.writeHead(200, {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=300',
          })
          res.end(data)
        } catch (err) {
          console.log('[proxy] fetch error', err.message, targetUrl)
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to fetch', message: err.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), corsProxy()],
  server: {
    port: 3000,
  },
})
