import {Codeowner} from '../src/index';
import * as teamNames from '../src/githubApi/getUserTeamsNames';
import * as octokit from '@octokit/rest';

let octo;
const params = {repo: '', owner: ''};

describe('Tests the 2 Apis', () => {
    beforeEach(() => {
        octo = new octokit({});
    });

    it('filterForCodeOwners', async () => {
        setMockedData({
            codeOwnersFileName: 'CODEOWNERS_1',
            mockedUsername: 'oreporan',
            mockedTeam: 'TestOrg/test-team',
        });

        const api = new Codeowner(params);
        const result = await api.filterForCodeOwners(
            ['/something/a.py', 'team-packages/something.js'],
            ['@oreporan', '@TestOrg/test-team']
        );
        expect(result.length).toEqual(2);
    });

    it('filterForAuthenticatedUser', async () => {
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
    octo.SET_MOCK_DATA({codeOwnersFileName, mockedUsername, mockedTeam});
