// src/config/env.js
import dotenv from "dotenv";
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI,
  cacheTtlSeconds: process.env.CACHE_TTL_SECONDS || 300,
};

export default env;