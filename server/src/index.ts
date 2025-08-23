import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import crypto from 'crypto'
import { configDotenv } from 'dotenv'

configDotenv()

const app = new Hono()
const secret = process.env.WEBHOOK_SECRET!

// Root route
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ElevenLabs Webhook
app.post('/webhook/elevenlabs', async (c) => {
  const signatureHeader = c.req.header('ElevenLabs-Signature')
  if (!signatureHeader) return c.text('Missing signature', 400)

  const headers = signatureHeader.split(',')
  const timestamp = headers.find((e) => e.startsWith('t='))?.substring(2)
  const signature = headers.find((e) => e.startsWith('v0='))

  if (!timestamp || !signature) return c.text('Invalid signature header', 400)

  // Validate timestamp (30 min tolerance)
  const reqTimestamp = Number(timestamp) * 1000
  const tolerance = Date.now() - 30 * 60 * 1000
  if (reqTimestamp < tolerance) return c.text('Request expired', 403)

  // Get raw body
  const rawBody = await c.req.text()

  // Validate hash
  const message = `${timestamp}.${rawBody}`
  const digest =
    'v0=' + crypto.createHmac('sha256', secret).update(message).digest('hex')

  if (signature !== digest) return c.text('Request unauthorized', 401)

  // ✅ Passed validation → process payload
  console.log('Webhook validated:', rawBody)

  return c.text('ok', 200)
})

// Start server
serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
