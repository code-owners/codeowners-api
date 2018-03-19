import * as octokit from '@octokit/rest';
import {RepoInfo} from '../types';

type ContentResponse = {
  name: string;
  path: string;
  data: string;
};

export class CodeownerLocator {
  repo: RepoInfo;
  auth?: octokit.Auth;

  constructor(repo: RepoInfo, auth?: octokit.Auth) {
    this.repo = repo;
    this.auth = auth;
  }

  private async locateInDir(path: string): Promise<string | null> {
    const octo = new octokit();
    this.auth && octo.authenticate(this.auth);
    try {
      const search = await octo.repos.getContent({path, ...this.repo});
      const codeOwnersLocation = search.data.filter(
        (x: ContentResponse) => x.name === 'CODEOWNERS'
      );

      if (codeOwnersLocation) return codeOwnersLocation[0].path;
      return null;
    } catch (err) {
      return null;
    }
  }

  public async locateCodeownersFile(): Promise<string> {
    const codeowners =
      (await this.locateInDir('/')) ||
      (await this.locateInDir('docs/')) ||
      (await this.locateInDir('.github/'));
    if (codeowners) return codeowners;

    throw new Error('Could not find CODEOWNERS file in allowed paths');
  }
}
