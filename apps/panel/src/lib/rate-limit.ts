import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const buckets = new Map<string, { count: number; resetAt: number }>();
const limiters = new Map<string, Ratelimit>();
let redis: Redis | undefined;
let warned = false;

export function clientIp(headers: Headers) {
  return (
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Upstash cuando está configurado; si no, un Map en memoria. El Map protege
 * poco en serverless (cada instancia tiene el suyo) pero no rompe nada, y
 * el login además tiene el límite por email.
 */
export async function rateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const configKey = `${limit}:${windowMs}`;
      let limiter = limiters.get(configKey);
      if (!limiter) {
        redis ??= new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        limiter = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
          prefix: `panel:rate-limit:${configKey}`,
          ephemeralCache: new Map(),
          analytics: false,
        });
        limiters.set(configKey, limiter);
      }
      const result = await limiter.limit(key);
      return { ok: result.success, resetAt: result.reset };
    } catch (error) {
      console.error("Upstash no disponible; límite local de emergencia", error);
    }
  } else if (!warned) {
    console.warn("UPSTASH_REDIS_REST_URL/TOKEN faltan: rate limiting en memoria (no distribuido)");
    warned = true;
  }

  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, resetAt: now + windowMs };
  }
  if (current.count >= limit) return { ok: false, resetAt: current.resetAt };
  current.count += 1;
  return { ok: true, resetAt: current.resetAt };
}
