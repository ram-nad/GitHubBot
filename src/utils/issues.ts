type issues = {
  issue_id: number;
  issue_number: number;
  issue_user_id: number;
  issue_user_login: string;
};

export function getIssue(payload: any): issues {
  return {
    issue_id: payload.issue.id,
    issue_number: payload.issue.number,
    issue_user_id: payload.issue.user.id,
    issue_user_login: payload.issue.user.login,
  };
}
