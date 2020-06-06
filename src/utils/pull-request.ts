type pr = {
  pull_id: number;
  pull_number: number;
  pull_user_id: number;
  pull_user_login: string;
  head_sha: string;
  head_repo: string;
  head_ref: string;
};

export function getPull(payload: any): pr {
  return {
    pull_id: payload.pull_request.id,
    pull_number: payload.pull_request.number,
    pull_user_id: payload.pull_request.user.id,
    pull_user_login: payload.pull_request.user.login,
    head_sha: payload.pull_request.head.sha,
    head_ref: payload.pull_request.head.ref,
    head_repo: payload.pull_request.head.repo.full_name,
  };
}
