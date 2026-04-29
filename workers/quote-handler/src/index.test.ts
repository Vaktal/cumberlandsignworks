import { describe, it, expect, vi, afterEach } from 'vitest'
import { isHoneypotFilled, verifyTurnstile } from './validate'

describe('isHoneypotFilled', () => {
  it('returns true when website field has a value', () => {
    const form = new FormData()
    form.set('website', 'http://spam.com')
    expect(isHoneypotFilled(form)).toBe(true)
  })

  it('returns false when website field is empty string', () => {
    const form = new FormData()
    form.set('website', '')
    expect(isHoneypotFilled(form)).toBe(false)
  })

  it('returns false when website field is absent', () => {
    const form = new FormData()
    expect(isHoneypotFilled(form)).toBe(false)
  })
})

describe('verifyTurnstile', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns true when Cloudflare responds with success: true', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    )
    expect(await verifyTurnstile('good-token', 'secret')).toBe(true)
  })

  it('returns false when Cloudflare responds with success: false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), { status: 200 })
    )
    expect(await verifyTurnstile('bad-token', 'secret')).toBe(false)
  })

  it('returns false when the response is non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Rate limited', { status: 429 })
    )
    expect(await verifyTurnstile('any-token', 'secret')).toBe(false)
  })

  it('returns false when fetch throws a network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network failure'))
    expect(await verifyTurnstile('any-token', 'secret')).toBe(false)
  })
})
