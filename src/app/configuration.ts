type assignes = {
  blob: string;
  assignes: string[];
};

type configuration = {
  issue: {
    message: string;
    assign: boolean;
  };
  pr: {
    message: string;
    assign: boolean;
    assignCondition: assignes[];
  };
};

export const defaultConfiguration: configuration = {
  issue: {
    message:
      "Hi @{ ACTOR }, thanks for opening this issue. Someone from development team with soon reach out to you.",
    assign: true,
  },
  pr: {
    message:
      "@{ ACTOR }, thanks for your contribution. Your PR will be reviewed soon.",
    assign: true,
    assignCondition: [] as assignes[],
  },
};
