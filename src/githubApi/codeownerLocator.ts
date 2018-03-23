import * as octokit from '@octokit/rest';
import {RepoInfo} from '../types';

type ContentResponse = {
    name: string;
    path: string;
    data: string;
};

export class CodeownerLocator {
    repo: RepoInfo;
    octo: octokit;
    auth?: octokit.Auth;

    constructor(repo: RepoInfo, auth?: octokit.Auth) {
        this.repo = repo;
        this.auth = auth;
        this.octo = new octokit();
        this.auth && this.octo.authenticate(this.auth);
    }

    private async locateInDir(path: string): Promise<string | null> {
        try {
            const search = await this.octo.repos.getContent({path, ...this.repo});
            const codeOwnersLocation = search.data.filter((x: ContentResponse) => x.name === 'CODEOWNERS');

            if (codeOwnersLocation) return codeOwnersLocation[0].path;
            return null;
        } catch (err) {
            return null;
        }
    }

    public async locateCodeownersFile(): Promise<string> {
        const codeowners =
            (await this.locateInDir('/')) || (await this.locateInDir('docs/')) || (await this.locateInDir('.github/'));
        if (codeowners) return codeowners;

        throw new Error('Could not find CODEOWNERS file in allowed paths');
    }

    public async getCodeownersFile(): Promise<octokit.AnyResponse> {
        const path = await this.locateCodeownersFile();

        return await this.octo.repos.getContent({path, ...this.repo});
    }
}
