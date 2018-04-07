import {Codeowner} from '../src/index';
import * as teamNames from '../src/githubApi/getUserTeamsNames';
import * as octokit from '@octokit/rest';

const params = {repo: '', owner: ''};

describe('filterForAuthenticatedUser', () => {
    it('happy flow', async () => {
        setMockedData({
            codeOwnersFileName: 'CODEOWNERS_2',
            mockedUsername: 'elayg',
            mockedTeam: 'TestOrg/test-team',
        });

        const api = new Codeowner(params, {type: 'token', token: 'xxx'});

        const result = await api.filterForAuthenticatedUser(['team-packages/something.js', 'packages/some/thing.txt']);
        expect(result.length).toEqual(2);
    });
});

const setMockedData = ({codeOwnersFileName, mockedUsername, mockedTeam}) =>
    new octokit({}).SET_MOCK_DATA({codeOwnersFileName, mockedUsername, mockedTeam});
