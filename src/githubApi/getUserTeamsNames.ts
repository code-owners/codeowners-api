import * as octokit from '@octokit/rest';

type Team = {
    name: string;
    id: number;
    slug: string;
    organization: {
        login: string;
        id: number;
    };
};

export const getUserTeamsNames = async (auth: octokit.Auth) => {
    const octo = new octokit({});
    octo.authenticate(auth);
    const [authenticatedUser, teams] = await Promise.all([octo.users.get({}), octo.users.getTeams({})]);

    return teams.data
        .map((t: Team) => `@${t.organization.login}/${t.slug}`)
        .concat([`@${authenticatedUser.data.login}`]);
};
