type issues = {
  pull_id: number;
  pull_number: number;
  pull_user_id: number;
  pull_user_login: string;
};

export function getPull(payload: any): issues {
  return {
    pull_id: payload.pull_request.id,
    pull_number: payload.pull_request.number,
    pull_user_id: payload.pull_request.user.id,
    pull_user_login: payload.pull_request.user.login,
  };
}
