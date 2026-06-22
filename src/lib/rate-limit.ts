import { prisma } from "./prisma";

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number; // milliseconds
};

const limits: Record<string, RateLimitConfig> = {
  forgotPassword: { maxRequests: 3, windowMs: 15 * 60 * 1000 }, // 3 requests / 15 min
  resetPassword: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests / 15 min
};

export async function checkRateLimit(
  identifier: string,
  action: string
): Promise<{ allowed: boolean; remaining: number }> {
  const config = limits[action];

  if (!config) {
    return { allowed: true, remaining: Infinity };
  }

  try {
    const now = new Date();
    const record = await prisma.rateLimit.findUnique({
      where: {
        identifier_action: { identifier, action },
      },
    });

    if (!record) {
      await prisma.rateLimit.create({
        data: {
          id: crypto.randomUUID(),
          identifier,
          action,
          count: 1,
          expiresAt: new Date(now.getTime() + config.windowMs),
        },
      });
      return { allowed: true, remaining: config.maxRequests - 1 };
    }

    if (record.expiresAt < now) {
      // Expired — reset
      await prisma.rateLimit.update({
        where: { id: record.id },
        data: {
          count: 1,
          expiresAt: new Date(now.getTime() + config.windowMs),
        },
      });
      return { allowed: true, remaining: config.maxRequests - 1 };
    }

    if (record.count >= config.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    await prisma.rateLimit.update({
      where: { id: record.id },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: config.maxRequests - record.count - 1,
    };
  } catch {
    // Fail open if database error
    return { allowed: true, remaining: 1 };
  }
}

// Cleanup expired rate limit records (call periodically)
export async function cleanupRateLimits() {
  try {
    await prisma.rateLimit.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    // Silently fail
  }
}