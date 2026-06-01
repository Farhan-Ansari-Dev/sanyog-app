const { getClient, getIsConnected } = require('../config/redis');

/**
 * Express middleware to cache responses in Redis.
 * @param {string} keyPrefix - The prefix for the Redis key.
 * @param {number} expirationInSeconds - How long to cache the data (TTL).
 * @param {function} customKeyFn - Optional function to generate a dynamic key (e.g. incorporating user ID).
 */
const cacheMiddleware = (keyPrefix, expirationInSeconds = 300, customKeyFn = null) => {
  return async (req, res, next) => {
    // 1. Bypass cache if Redis is down
    if (!getIsConnected() || !getClient()) {
      return next();
    }
    const client = getClient();

    // 2. Generate Cache Key
    let cacheKey = keyPrefix;
    if (customKeyFn) {
      cacheKey = customKeyFn(req);
    } else {
      // Default dynamic key based on query params to handle pagination/filtering
      const queryStr = new URLSearchParams(req.query).toString();
      if (queryStr) cacheKey += `?${queryStr}`;
    }

    try {
      // 3. Check Cache
      const cachedData = await client.get(cacheKey);
      
      if (cachedData) {
        // Cache Hit!
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      // 4. Cache Miss - Intercept res.json to save data before sending
      res.setHeader('X-Cache', 'MISS');
      const originalJson = res.json;
      
      res.json = function (body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            client.setEx(cacheKey, expirationInSeconds, JSON.stringify(body));
          } catch (err) {
            console.error('[Redis] Failed to cache data for key:', cacheKey, err.message);
          }
        }
        // Call original json method to send response to client
        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      console.error('[Redis] Middleware Error:', err.message);
      next(); // Proceed to DB if cache fails
    }
  };
};

module.exports = cacheMiddleware;
