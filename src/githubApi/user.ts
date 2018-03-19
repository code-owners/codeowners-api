import * as octokit from '@octokit/rest';

type UserTeamsResponse = {
  data: {
    name: string;
    id: number;
    slug: string;
    description: string;
    privacy: string;
    url: string;
    members_url: string;
    repositories_url: string;
    permission: string;
    created_at: octokit.date;
    updated_at: octokit.date;
    members_count: number;
    repos_count: number;
    organization: {};
    parent: {};
  }[];
};

export const getUserTeamsNames = async (token: string) => {
  const octo = new octokit({});
  octo.authenticate({
    type: 'token',
    token,
  });
  const res = (await octo.users.getTeams({})) as UserTeamsResponse;
  return res.data.map(t => t.name);
};
