import { getAppToken, getInstallationToken } from "../github/get-tokens";
import GitHubEvent from "./event";

export const appToken = getAppToken;
export const installationToken = getInstallationToken;

export const githubEvent = new GitHubEvent();

// Define new event listeners here.
// Do not to throw errors.
// Handle all the promise rejections.

githubEvent.on("*", (req, event, action, context, payload) => {
  console.debug(`${event}.${action}:`, payload);
});
