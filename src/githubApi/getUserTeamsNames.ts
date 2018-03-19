import * as octokit from '@octokit/rest';

type UserTeamsResponse = {
    data: {
        name: string;
        id: number;
        slug: string;
        organization: {
            login: string;
            id: number;
        };
    }[];
};

export const getUserTeamsNames = async (auth: octokit.Auth) => {
    const octo = new octokit({});
    octo.authenticate(auth);
    const res = (await octo.users.getTeams({})) as UserTeamsResponse;

    return res.data.map(t => `@${t.organization.login}/${t.slug}`);
};
