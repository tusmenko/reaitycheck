// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    // Existing environment variables (for completeness)
    NEXT_PUBLIC_CONVEX_URL: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_CONVEX_SITE_URL: string;
    NEXT_PUBLIC_TURNSTILE_SITEKEY: string;

    // New: App version from package.json
    NEXT_PUBLIC_APP_VERSION: string;

    // Server-only vars
    OPENROUTER_API_KEY: string;
    CONVEX_DEPLOYMENT: string;
    API_SECRET_KEY: string;
    CRON_SECRET: string;
    TURNSTILE_SECRETKEY: string;
    SENTRY_AUTH_TOKEN: string;
    SYNC_MODEL_LIST?: "free" | "paid" | "all";
    OPENROUTER_APP_URL?: string;
    OPENROUTER_APP_TITLE?: string;
  }
}

export {};
