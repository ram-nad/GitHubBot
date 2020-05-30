import { getInstallationAPI } from "../github/installations";
import GitHubEvent from "./event";
import { getIssue } from "../utils/issues";

export const githubEvent = new GitHubEvent();

// Define new event listeners here.
// Handle all the promise rejections.

// githubEvent.on("*", (req, event, action, context, payload) => {
//   console.debug(`${event}.${action}:`, payload);
// });

githubEvent.on(
  "issues.opened",
  async (req, event, action, context, payload) => {
    const API = await getInstallationAPI(context.installationId!);
    const issue = getIssue(payload);
    await API.issues.createComment({
      owner: context.owner!,
      repo: context.repo!,
      issue_number: issue.issue_number,
      body: `Hi @${issue.issue_user_login}, thanks for opening this issue. Someone from development team will soon reach out to you.`,
    });
    try {
      const res = await API.issues.checkAssignee({
        owner: context.owner!,
        repo: context.repo!,
        assignee: issue.issue_user_login,
      });
      if (res.status === 204) {
        await API.issues.addAssignees({
          owner: context.owner!,
          repo: context.repo!,
          issue_number: issue.issue_number,
          assignees: [issue.issue_user_login],
        });
      }
    } catch (err) {} // Work around
  }
);
