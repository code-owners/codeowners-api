import {MappedData} from '../types';

const mapCodeownersFile = (codeownersFileContent: string): MappedData[] => {
    return codeownersFileContent
        .split('\n')
        .filter(x => x && !x.startsWith('#'))
        .map(x => {
            const [pathString, ...owners] = x.split(/\s+/);
            return {pathString, owners};
        });
};

export default mapCodeownersFile;
