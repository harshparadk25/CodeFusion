import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisOptions = {
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    console.log(`🔄 Redis retry attempt ${times}, next in ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  lazyConnect: true,
};

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, redisOptions);
} else {
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT?.trim() || 11796),
    password: process.env.REDIS_PASSWORD,
    ...redisOptions,
  });
}

redisClient.on("connect", () =>
  console.log("✅ Redis connected successfully!")
);
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

// Explicitly connect (since lazyConnect is true)
redisClient.connect().catch((err) => {
  console.error("❌ Redis initial connection failed:", err.message);
});

export default redisClient;
