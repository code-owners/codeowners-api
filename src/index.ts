import {Auth} from '@octokit/rest';
import {getUserTeamsNames, CodeownerLocator} from './githubApi';
import {RepoInfo} from './types';
import mapCodeownersFile from './utils/mapCodeownersFile';
import hasMatch from './utils/hasMatch';

/** Class representing a CodeOwners Api Object. */
export class Codeowner {
    repo: RepoInfo;
    auth?: Auth;

    /**
     * Create a CodeOwners Api Object.
     * @param repoParams - represents github repository information.
     * @param auth - optional, for private repositories a github access_token is required.
     */
    constructor(repoParams: RepoInfo, auth?: Auth) {
        this.repo = repoParams;
        this.auth = auth;
    }

    /**
     * Boolean - returns true if a CODEOWNERS file exists for this remote repository
     */
    public async codeownersFileExists(): Promise<boolean> {
        try {
            const locator = new CodeownerLocator(this.repo, this.auth);
            return !!await locator.locateCodeownersFile();
        } catch (e) {
            return false;
        }
    }

    /**
     * string - returns the CODEOWNERS file as a string from the remote repository
     */
    public async getCodeownersFile(): Promise<string> {
        const locator = new CodeownerLocator(this.repo, this.auth);
        const file = await locator.getCodeownersFile();
        return Buffer.from(file.data.content, 'base64').toString();
    }

    /**
     * Returns a list paths which the authenticated user (from the Auth params in the constructor)
     * Is a CODEOWNER of, This method will also check the user's teams for matches.
     * @param paths - List of strings to match the authenticated user against.
     */
    public async filterForAuthenticatedUser(paths: string[]): Promise<string[]> {
        const codeowner = await this.getCodeownersFile();
        const mappedFile = mapCodeownersFile(codeowner);

        const teams = this.auth ? await getUserTeamsNames(this.auth) : [];
        return paths.filter(requestedPath => hasMatch(mappedFile, [...teams], requestedPath));
    }

    /**
     * Returns a list paths which the authenticated user (from the Auth params in the constructor)
     * Is a CODEOWNER of, This method will also check the user's teams for matches.
     * @param paths - List of paths to run the filter on.
     * @param codeowners - List of users and teams to match against.
     */
    public async filterForCodeOwners(paths: string[], codeowners: string[]): Promise<string[]> {
        const codeowner = await this.getCodeownersFile();
        const mappedFile = mapCodeownersFile(codeowner);
        return paths.filter(requestedPath => hasMatch(mappedFile, [...codeowners], requestedPath));
    }
}
