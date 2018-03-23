import {Auth} from '@octokit/rest';
import {getUserTeamsNames, CodeownerLocator} from './githubApi';
import {RepoInfo} from './types';
import mapCodeownersFile from './utils/mapCodeownersFile';
import hasMatch from './utils/hasMatch';

export class Codeowner {
    repo: RepoInfo;
    auth?: Auth;

    constructor(repoParams: RepoInfo, auth?: Auth) {
        this.repo = repoParams;
        this.auth = auth;
    }

    public async codeownersFileExists(): Promise<boolean> {
        try {
            const locator = new CodeownerLocator(this.repo, this.auth);
            return !!await locator.locateCodeownersFile();
        } catch (e) {
            return false;
        }
    }

    public async getCodeownersFile(): Promise<string> {
        const locator = new CodeownerLocator(this.repo, this.auth);
        const file = await locator.getCodeownersFile();
        return Buffer.from(file.data.content, 'base64').toString();
    }

    public async filterForCodeOwner(paths: string[], codeOwner: string): Promise<string[]> {
        const codeowner = await this.getCodeownersFile();
        const mappedFile = mapCodeownersFile(codeowner);

        const teams = this.auth ? await getUserTeamsNames(this.auth) : [];
        return paths.filter(requestedPath => hasMatch(mappedFile, [codeOwner, ...teams], requestedPath));
    }
}
