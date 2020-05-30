import { config } from "dotenv";
config();

import { DEV_WEBHOOK_URL, WEBHOOK_URL, PORT } from "./app/config";
// @ts-ignore
import SmeeClient from "smee-client";
import { startServer, closeServer } from "./app/server";

interface logger {
  error: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
  log: (message?: any, ...optionalParams: any[]) => void;
  debug: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
}

var smeeLog: logger = {
  error: (message, ...optional) => {
    console.error("[Smee Error]", message, optional);
  },
  info: (message, ...optional) => {
    console.info("[Smee Info]", message, optional);
  },
  log: (message, ...optional) => {
    console.log("[Smee Log]", message, optional);
  },
  warn: (message, ...optional) => {
    console.warn("[Smee Warn]", message, optional);
  },
  debug: (message, ...optional) => {
    console.debug("[Smee Debug]", message, optional);
  },
};

const smee = new SmeeClient({
  source: DEV_WEBHOOK_URL,
  target: WEBHOOK_URL,
  logger: smeeLog,
});

let events: any = undefined;

startServer(PORT).then(() => {
  events = smee.start();
  console.log(`Smee Client listening at [${DEV_WEBHOOK_URL}]`);
});

const exitHandle: NodeJS.SignalsListener = async (signal) => {
  console.log("Development server is stopping");
  events.close();
  await closeServer();
  process.exit();
};

process.on("SIGINT", exitHandle);
process.on("SIGTERM", exitHandle);
