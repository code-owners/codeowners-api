import * as anymatch from 'anymatch';
import {MappedData} from '../types';

const startWithBackslash = (str: string) => (str.startsWith('/') ? str : `/${str}`);

const hasMatch = (mappedFile: MappedData[], codeOwners: string[], path: string) => {
    const match = mappedFile
        .slice()
        .reverse()
        .find(x => anymatch(`${startWithBackslash(x.path)}*`, startWithBackslash(path)));
    if (!match) return false;

    return match.owners.some(o => codeOwners.includes(o));
};

export default hasMatch;
