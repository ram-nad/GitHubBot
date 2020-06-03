import GitHubEvent from "./event";
import { getIssue } from "../utils/issues";
import { getPull } from "../utils/pull-request";
import { match } from "minimatch";
import { assignConditions } from "./configuration";

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
        .replace(/{ ACTOR }/g, issue.issue_user_login)
        .replace(/{ NUMBER }/g, issue.issue_number.toString()),
    });
    if (
      !(
        context.config.issue.assign == false ||
        context.config.issue.assign == "false"
      )
    ) {
      await API.issues.addAssignees({
        owner: context.owner!,
        repo: context.repo!,
        issue_number: issue.issue_number,
        assignees: [issue.issue_user_login],
      }); // This will fail silently if `user` cannot be assigned to this `issue`
    }
  }
);

githubEvent.on(
  "pull_request.opened",
  async (req, event, action, context, payload) => {
    const API = context.installation!;
    const pull = getPull(payload);
    await API.issues.createComment({
      owner: context.owner!,
      repo: context.repo!,
      issue_number: pull.pull_number,
      body: (context.config.pr.message + "")
        .replace(/{ ACTOR }/g, pull.pull_user_login)
        .replace(/{ NUMBER }/g, pull.pull_number.toString()),
    });
    if (
      !(
        context.config.pr.assign == false || context.config.pr.assign == "false"
      )
    ) {
      let assignes = new Set<string>();
      let fileOptions = await API.pulls.listFiles.endpoint.merge({
        owner: context.owner!,
        repo: context.repo!,
        pull_number: pull.pull_number,
      });
      let files = await API.paginate<any>(fileOptions);
      let fileNames: string[] = files.map((file) => file.filename);
      let conditions: assignConditions[] = context.config.pr.conditions;
      conditions.forEach((element) => {
        if (match(fileNames, element.glob)) {
          let a = element.assignes;
          a.forEach((val) => assignes.add(val));
        }
      });
      await API.issues.addAssignees({
        owner: context.owner!,
        repo: context.repo!,
        issue_number: pull.pull_number,
        assignees: Array.from(assignes),
      });
    }
  }
);
