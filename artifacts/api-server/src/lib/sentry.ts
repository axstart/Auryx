/**
 * Optional Sentry bootstrap for the API.
 * Activates only when SENTRY_DSN is set. Install `@sentry/node` in production to enable.
 */
export async function initApiSentry(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    // Avoid a hard compile-time dependency — resolve at runtime if installed.
    const req = new Function("m", "return import(m)") as (m: string) => Promise<{
      init: (opts: Record<string, unknown>) => void;
    }>;
    const Sentry = await req("@sentry/node");
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV ?? "development",
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
    console.info("[sentry] API monitoring initialized");
  } catch (err) {
    console.warn("[sentry] failed to initialize (is @sentry/node installed?)", err);
  }
}
