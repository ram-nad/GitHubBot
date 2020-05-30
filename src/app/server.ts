import express from "express";
import { APP_NAME, GH_URL } from "./config";
import verifyPayload from "../github/verify-payload";
import { githubEvent } from "./app";
import { Server } from "http";

const app = express();

app.enable("case sensetive routing");
app.enable("trust proxy");
app.disable("strict routing");
app.disable("x-powered-by");

const HTML = `<!DOCTYPE html>
<html>
    <head>
        <title>${APP_NAME} | GitHub App</title>
    </head>
    <body style="width: 100vw; height: 100vh; position: relative;">
        <div style="height: 250px; width: 400px; position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); border: 1px solid black; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center;">
            <h1 style="text-align: center;">${APP_NAME}</h1>
            <br />
            <br />
            <a href="${GH_URL}" style="color: blue; font-size: 24px; font-weight: bold; padding: 20px; border: 2px solid blue; text-decoration: none; border-radius: 15px;">Install App</a>
        </div>
    </body>
</html>`;

const verifyReqBuffer = (signature: string, buf: string): boolean => {
  return verifyPayload(signature, buf);
};

const requestError = (message: any, ...optional: any[]): void => {
  console.info("Request Error: ", message, optional);
};

app.get("/ping", (req, res, next) => {
  res.status(200).send("PONG!");
});

app.get("/", (req, res, next) => {
  res.status(200).send(HTML);
});

app.post(
  "/",
  express.raw({ limit: "25mb", type: "application/*" }),
  (req, res, next) => {
    if (req.headers["content-type"] != "application/json") {
      requestError("Payload is not in JSON format");
      res.send(400).send("Only JSON data is accepted.");
    } else {
      const event = req.headers["x-github-event"] as string;
      const signature = req.headers["x-hub-signature"] as string;
      const deliveryId = req.headers["x-github-delivery"];
      if (!event || !signature || !deliveryId) {
        requestError("Invalid Request [Missing Headers]");
        res.status(400).send("Bad Request");
      } else {
        const body = (req.body as Buffer).toString("utf-8");
        const verified = verifyReqBuffer(signature, body);
        if (!verified) {
          res.status(401).send("Signature could not be verified");
        } else {
          let payload: any;
          try {
            payload = JSON.parse(body);
          } catch (e) {
            requestError("Payload could not be parsed.");
            res.status(400).send("Invalid JSON");
            return;
          }
          const action: string = payload?.action;
          const installationId: number = payload?.installation?.id;
          const repo: string = payload?.repository?.name;
          const owner: string = payload?.repository?.owner?.login;
          const repositoryId: number = payload?.repository?.id;
          const ownerId: number = payload?.repository?.owner?.id;
          const senderId: number = payload?.sender?.id;
          const senderLogin: string = payload?.sender?.login;
          githubEvent.handleEvent(
            event,
            action,
            {
              installationId,
              owner,
              ownerId,
              repo,
              repositoryId,
              senderId,
              senderLogin,
            },
            req,
            payload
          );
          res.status(200).send("OK");
        }
      }
    }
  }
);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

let server: Server | undefined = undefined;

export async function startServer(port: number): Promise<void> {
  await new Promise((res) => {
    if (!server) {
      server = app.listen(port, () => {
        console.log(`Server started on PORT [${port}]`);
        res();
      });
    } else {
      console.warn("Server already running");
      res();
    }
  });
}

export async function closeServer(): Promise<void> {
  await new Promise((res) => {
    if (server) {
      if (server.listening) {
        server.close(() => {
          res();
        });
      } else {
        console.warn("Server already stopped");
        res();
      }
    } else {
      console.warn("Server not started yet");
      res();
    }
  });
}
