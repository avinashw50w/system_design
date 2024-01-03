const express = require('express');
const Redis = require('ioredis');

const app = express();
const redisOptions = {
  /* Redis connection options */
};

class RateLimiter {
  constructor(redisOptions) {
    this.redis = new Redis(redisOptions);
  }

  async checkRateLimit(key, limit, windowSize) {
    const currentTime = Math.floor(Date.now() / 1000); // in secs
    const windowStart = currentTime - windowSize + 1;

    const transaction = this.redis.multi();
    transaction.zadd(key, currentTime, currentTime);
    transaction.zremrangebyscore(key, 0, windowStart - 1);
    transaction.zcard(key);
    transaction.expire(key, windowSize);

    const [, , count] = await transaction.exec();

    return count <= limit;
  }
}

const rateLimiter = new RateLimiter(redisOptions);

// Custom middleware function
async function rateLimitMiddleware(req, res, next) {
  const key = `rate_limit:${req.ip}`;
  // 100 requests per 60 secs
  const limit = 100;
  const windowSize = 60;

  const allowed = await rateLimiter.checkRateLimit(key, limit, windowSize);
  if (allowed) {
    next(); // Continue to the next middleware or route handler
  } else {
    res.status(429).send('Rate limit exceeded'); // Return a 429 status code for rate limit exceeded
  }
}

// Apply the middleware to the desired routes
app.get('/protected', rateLimitMiddleware, (req, res) => {
  res.send('Protected route');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
