import * as anymatch from 'anymatch';
import {MappedData} from '../types';

const startWithBackslash = (str: string) => (str.startsWith('/') ? str : `/${str}`);

const hasMatch = (mappedFile: MappedData[], codeOwners: string[], path: string) =>
    mappedFile.some(
        x =>
            x.owners.some(o => codeOwners.includes(o)) &&
            anymatch(`${startWithBackslash(x.path)}*`, startWithBackslash(path))
    );

export default hasMatch;
