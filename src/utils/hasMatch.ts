import * as anymatch from 'anymatch';
import {MappedData} from '../types';

const startWithBackslash = (str: string) =>
    str.startsWith('/') ? str : `/${str}`;

const hasMatch = (mappedFile: MappedData[], codeOwner: string, path: string) =>
    mappedFile.some(
        x =>
            x.owners.includes(codeOwner) &&
            anymatch(`${startWithBackslash(x.path)}*`, startWithBackslash(path))
    );

export default hasMatch;
