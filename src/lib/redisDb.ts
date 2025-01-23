import { createClient } from "redis";

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.error("Redis Client Error:", err));

// Initialize the client connection
(async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("Connected to Redis");
  }
})();

export default client;
