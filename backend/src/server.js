import app from './app.js';
import connectDatabase from './config/database.js';
import { randomBytes } from 'crypto';
import dns from 'dns';
import env from './config/env.js';

const PORT = process.env.PORT || 8080;

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Waygood evaluation API running on port ${env.port}`);
  });
}

// const secret = randomBytes(32).toString('hex');
// console.log(secret);

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});