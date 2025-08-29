import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import User from "../models/user.models.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await redisClient.get(`blacklisted_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("🔑 Decoded token payload:", decoded); // 👈 add this log

    const user = await User.findById(decoded._id || decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;   // 👈 always has _id
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
