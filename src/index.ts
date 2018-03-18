import * as anymatch from 'anymatch';
import {getCodeOwnersFile, GetCodeOwnersFileParams} from './githubApi';

let repoData : GetCodeOwnersFileParams;

interface MappedData {
    pathString: string;
    owners: string[];
}

export interface CodeOwner {
    name: string;
    pathString: string;
}

export interface Path {
    pathString: string;
}

export const initialize = (repoParams: GetCodeOwnersFileParams): void => {
    repoData = {...repoParams}
};


export const filterForCodeOwner = async (paths: string[], codeOwner: string): Promise<Path[]> => {
    const mappedFile = await mapCodeOwnersFile()
    const matches = paths
        .filter(requestedPath => hasSingleMatch(mappedFile, codeOwner, requestedPath))
        .map(result => convertToPath(result))
    return matches
};


const hasSingleMatch = (mappedFile: MappedData[], codeOwner: string, path: string) => mappedFile.some(x => x.owners.includes(codeOwner) && anymatch(x.pathString, path))

const convertToPath = (pathString: string):Path => ({pathString})

const mapCodeOwnersFile = async (): Promise<MappedData[]> => {
    const data = await getCodeOwnersFile(repoData);
    return data
        .split('\n')
        .filter(x => x && !x.startsWith('#'))
        .map(x => {
            const [pathString, ...owners] = x.split(/\s+/);
            return {pathString, owners};
        });
};