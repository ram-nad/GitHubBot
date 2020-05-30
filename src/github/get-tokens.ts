import jwt from "jsonwebtoken";
import { APP_ID, PRIVATE_KEY, TZ, APP_NAME } from "../app/config";
import { Octokit } from "@octokit/rest";

let CACHE_TIME = Number.MAX_SAFE_INTEGER;
let TOKEN = "";

const WAIT_TIME = 450; // 7.5 minutes
const EXP_TIME = 600; // 10 minutes

function genToken(): string {
  let currentTime = Math.floor(Date.now() / 1000);
  const payload = {
    iat: currentTime,
    exp: currentTime + EXP_TIME,
    iss: APP_ID,
  };
  CACHE_TIME = currentTime;
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    mutatePayload: false,
  });
}

export function getAppToken(): string {
  let currentTime = Math.floor(Date.now() / 1000);
  if (CACHE_TIME - currentTime > WAIT_TIME) {
    TOKEN = genToken();
  }
  return TOKEN;
}

export const getInstallationToken = async function (
  installationId: number
): Promise<string> {
  const GitHubAPI = new Octokit({
    timeZone: TZ,
    auth: getAppToken(),
    userAgent: APP_NAME,
    previews: ["machine-man"],
  });
  const data = await GitHubAPI.apps.createInstallationToken({
    installation_id: installationId,
  });
  return data.data.token;
};
