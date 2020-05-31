import { Octokit } from "@octokit/rest";
import { safeLoad } from "js-yaml";

const CONFIG_FILE = ".github/bot.yml";

export async function getConfiguration(
  installation: Octokit,
  owner: string,
  repo: string
): Promise<any> {
  try {
    const data = (
      await installation.repos.getContents({
        owner: owner,
        repo: repo,
        path: CONFIG_FILE,
      })
    ).data;
    if (data.type !== "file") {
      return {};
    } else {
      return safeLoad(Buffer.from(data.content, "base64").toString(), {
        json: true,
      });
    }
  } catch (err) {
    return {}; // In case we don't find config file, we return empty config.
  }
}
