import {Codeowner} from '../src/index';
import * as teamNames from '../src/githubApi/getUserTeamsNames';
import * as octokit from '@octokit/rest';

const params = {repo: '', owner: ''};

describe('filterForCodeOwners', () => {
    it('happy flow', async () => {
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

    it('returns no files if file is not listed in CODEOWNERS', async () => {
        setMockedData({
            codeOwnersFileName: 'CODEOWNERS_1',
            mockedUsername: 'oreporan',
            mockedTeam: 'TestOrg/test-team',
        });

        const api = new Codeowner(params);
        const result = await api.filterForCodeOwners(['/not-listed/path.js'], ['@oreporan', '@TestOrg/test-team']);
        expect(result.length).toEqual(0);
    });
});

const setMockedData = ({codeOwnersFileName, mockedUsername, mockedTeam}) =>
    new octokit({}).SET_MOCK_DATA({codeOwnersFileName, mockedUsername, mockedTeam});
