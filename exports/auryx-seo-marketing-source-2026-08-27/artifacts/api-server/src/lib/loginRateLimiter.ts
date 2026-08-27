const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  windowStart: number;
  blockedAt: number | null;
}

const store = new Map<string, AttemptRecord>();

export function getIp(req: { headers: Record<string, string | string[] | undefined>; socket: { remoteAddress?: string } }): string {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return (Array.isArray(fwd) ? fwd[0] : fwd).split(",")[0]!.trim();
  return req.socket.remoteAddress ?? "unknown";
}

function getRecord(ip: string): AttemptRecord | null {
  const now = Date.now();
  const r = store.get(ip);
  if (!r) return null;
  if (r.blockedAt === null && now - r.windowStart >= WINDOW_MS) {
    store.delete(ip);
    return null;
  }
  return r;
}

export function checkBlocked(ip: string): { blocked: boolean; error?: string } {
  const r = getRecord(ip);
  if (!r) return { blocked: false };
  if (r.blockedAt !== null && Date.now() - r.blockedAt < WINDOW_MS) {
    return { blocked: true, error: "Too many login attempts. Please try again in 15 minutes." };
  }
  return { blocked: false };
}

export function recordFailure(ip: string): { nowBlocked: boolean; remaining: number } {
  const now = Date.now();
  let r = getRecord(ip);
  if (!r) {
    r = { count: 0, windowStart: now, blockedAt: null };
  }
  r.count += 1;

  if (r.count >= MAX_ATTEMPTS) {
    r.blockedAt = now;
    store.set(ip, r);
    return { nowBlocked: true, remaining: 0 };
  }

  store.set(ip, r);
  return { nowBlocked: false, remaining: MAX_ATTEMPTS - r.count };
}

export function clearAttempts(ip: string): void {
  store.delete(ip);
}
