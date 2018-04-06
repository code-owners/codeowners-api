import ignore = require('ignore');
import {MappedData} from '../types';

const hasMatch = (mappedFile: MappedData[], codeOwners: string[], path: string) => {
    const match = mappedFile
        .slice()
        .reverse()
        .find(x =>
            ignore()
                .add(x.path)
                .ignores(path)
        );
    if (!match) return false;
    return match.owners.some(o => codeOwners.includes(o));
};

export default hasMatch;
