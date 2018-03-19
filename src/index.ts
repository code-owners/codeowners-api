import * as octokit from '@octokit/rest';
import {getUserTeamsNames, CodeownerLocator} from './githubApi';
import {RepoInfo} from './types';
import mapCodeownersFile from './utils/mapCodeownersFile';
import hasMatch from './utils/hasMatch';

export {getUserTeamsNames};

export default class Codeowner {
    repo: RepoInfo;
    auth?: octokit.Auth;

    constructor(repoParams: RepoInfo, auth?: octokit.Auth) {
        this.repo = repoParams;
        this.auth = auth;
    }

    public async isCodeownersFileExists() {
        try {
            const locator = new CodeownerLocator(this.repo, this.auth);
            return !!await locator.locateCodeownersFile();
        } catch (e) {
            return false;
        }
    }

    public async getCodeownersFile(): Promise<string> {
        const locator = new CodeownerLocator(this.repo, this.auth);
        const path = await locator.locateCodeownersFile();

        const octo = await new octokit();
        this.auth && octo.authenticate(this.auth);
        const file = await octo.repos.getContent({path, ...this.repo});
        return Buffer.from(file.data.content, 'base64').toString();
    }

    public async filterForCodeOwner(paths: string[], codeOwner: string): Promise<string[]> {
        const codeowner = await this.getCodeownersFile();
        const mappedFile = mapCodeownersFile(codeowner);

        const teams = this.auth ? await getUserTeamsNames(this.auth) : [];

        return paths.filter(requestedPath => hasMatch(mappedFile, [codeOwner, ...teams], requestedPath));
    }
}
