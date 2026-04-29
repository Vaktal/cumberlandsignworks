import { describe, it, expect } from 'vitest'
import { isHoneypotFilled } from './validate'

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
