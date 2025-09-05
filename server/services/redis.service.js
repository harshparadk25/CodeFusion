import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
} else {
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT?.trim() || 11796),
    password: process.env.REDIS_PASSWORD,
  });
}

redisClient.on("connect", () =>
  console.log("✅ Redis connected successfully!")
);
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

export default redisClient;
