export function isHoneypotFilled(form: FormData): boolean {
  const val = form.get('website')
  return typeof val === 'string' && val.length > 0
}

export async function verifyTurnstile(
  token: string,
  secretKey: string
): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    })
    if (!res.ok) return false
    const data = await res.json() as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
