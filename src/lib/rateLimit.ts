interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = store[key];

  if (!record) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs
    };
    return true;
  }

  if (now > record.resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs
    };
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}