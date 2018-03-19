import * as anymatch from 'anymatch';
import * as octokit from '@octokit/rest';
import {getUserTeamsNames, CodeownerLocator} from './githubApi';
import {RepoInfo} from './types';

export {getUserTeamsNames};

type MappedData = {
  pathString: string;
  owners: string[];
};

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

  public async filterForCodeOwner(
    paths: string[],
    codeOwner: string
  ): Promise<string[]> {
    const mappedFile = await this.mapCodeOwnersFile();
    return paths.filter(requestedPath =>
      this.hasSingleMatch(mappedFile, codeOwner, requestedPath)
    );
  }

  private hasSingleMatch(
    mappedFile: MappedData[],
    codeOwner: string,
    path: string
  ) {
    return mappedFile.some(
      x => x.owners.includes(codeOwner) && anymatch(x.pathString, path)
    );
  }

  private async mapCodeOwnersFile(): Promise<MappedData[]> {
    const data = await this.getCodeownersFile();
    return data
      .split('\n')
      .filter(x => x && !x.startsWith('#'))
      .map(x => {
        const [pathString, ...owners] = x.split(/\s+/);
        return {pathString, owners};
      });
  }
}
