import { TZ, APP_NAME } from "../app/config";
import LRUCache from "lru-cache";
import { Octokit } from "@octokit/rest";
import { getInstallationToken } from "./get-tokens";

type APICache = LRUCache<number, Octokit>;

const DATA_LIMIT = 100;
const TIME_LIMIT = 55 * 60 * 1000; // One Token is valid for 1 hour.

const Cache: APICache = new LRUCache<number, Octokit>({
  max: DATA_LIMIT,
  maxAge: TIME_LIMIT,
});

async function getInstallationAPI(installationId: number): Promise<Octokit> {
  let GitHubAPI = Cache.get(installationId);
  if (!GitHubAPI) {
    GitHubAPI = new Octokit({
      timeZone: TZ,
      userAgent: APP_NAME,
      auth: await getInstallationToken(installationId),
    });
    Cache.set(installationId, GitHubAPI);
  }
  return GitHubAPI;
}
