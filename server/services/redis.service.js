// redis.service.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // ✅ Make sure env variables are loaded first


const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT?.trim() || 11796),
  password: process.env.REDIS_PASSWORD,
   // enable TLS for Redis Cloud
});

console.log('Using Redis port:', process.env.REDIS_PORT, Number(process.env.REDIS_PORT));


redisClient.on("connect", () => console.log("✅ Redis connected successfully!"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

export default redisClient;
