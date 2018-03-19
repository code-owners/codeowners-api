import * as anymatch from 'anymatch';
import {MappedData} from '../types';

const hasMatch = (
    mappedFile: MappedData[],
    codeOwner: string,
    path: string
) => {
    return mappedFile.some(
        x => x.owners.includes(codeOwner) && anymatch(x.pathString, path)
    );
};

export default hasMatch;
