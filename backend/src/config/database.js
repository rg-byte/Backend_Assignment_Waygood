<<<<<<< HEAD
﻿import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
=======
﻿import mongoose from "mongoose";
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
import env from "./env.js";

async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB");
}

export default connectDatabase;