import { config } from "dotenv";
config();

import { WEBHOOK_URL, PORT } from "./app/config";
import { startServer, closeServer } from "./app/server";

startServer(PORT).then(() => {
  console.log(`Server [${WEBHOOK_URL}]`);
});

const exitHandle: NodeJS.SignalsListener = async (signal) => {
  console.log("Stopping Server");
  await closeServer();
  process.exit();
};

process.on("SIGINT", exitHandle);
process.on("SIGTERM", exitHandle);
