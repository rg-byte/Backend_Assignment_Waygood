import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import env from "./env.js";
async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB");
}

export default connectDatabase;