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
    const API = context.installation!;
    const issue = getIssue(payload);
    await API.issues.createComment({
      owner: context.owner!,
      repo: context.repo!,
      issue_number: issue.issue_number,
      body: (context.config.issue.message + "")
        .replace(
          /([^"] | ^){ ACTOR }([^"] | $)/g,
          "$1" + issue.issue_user_login + "$2"
        )
        .replace(
          /([^"] | ^){ NUMBER }([^"] | $)/g,
          "$1" + issue.issue_number.toString() + "$2"
        ),
    });
    if (
      !(
        context.config.issue.assign == false ||
        context.config.issue.assign == "false"
      )
    ) {
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
  }
);
