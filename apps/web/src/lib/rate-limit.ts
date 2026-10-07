import { Redis } from "@upstash/redis";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let redis: Redis | undefined;

export type RateLimitOptions = { key: string; limit: number; windowMs: number };

/**
 * Rate limit con Upstash cuando está configurado y un Map en memoria como
 * respaldo. El respaldo protege poco en serverless (cada instancia tiene su
 * propio Map), pero alcanza para el MVP y no rompe nada si falta Upstash.
 */
export async function rateLimit(options: RateLimitOptions) {
  if (upstashConfigured()) {
    try {
      return await upstashRateLimit(options);
    } catch (error) {
      console.error("Upstash rate limit failed, falling back to local bucket", error);
    }
  }
  return localRateLimit(options);
}

function localRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (current.count >= limit) return { ok: false, remaining: 0, resetAt: current.resetAt };

  current.count += 1;
  return { ok: true, remaining: limit - current.count, resetAt: current.resetAt };
}

async function upstashRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const redisKey = `rate-limit:${key}`;
  const count = await getRedis().incr(redisKey);
  if (count === 1) await getRedis().pexpire(redisKey, windowMs);
  const ttlMs = await getRedis().pttl(redisKey);
  const resetAt = now + (ttlMs > 0 ? ttlMs : windowMs);
  return { ok: count <= limit, remaining: Math.max(0, limit - count), resetAt };
}

function getRedis() {
  redis ??= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ?? "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  });
  return redis;
}

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
