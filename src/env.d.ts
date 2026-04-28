/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_BUSINESS_PHONE: string;
  readonly PUBLIC_BUSINESS_PHONE_DISPLAY: string;
  readonly PUBLIC_BUSINESS_EMAIL: string;
  readonly PUBLIC_BUSINESS_ADDRESS: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT?: string;
  readonly PUBLIC_QUOTE_ENDPOINT?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
