import {MappedData} from '../types';

const mapCodeownersFile = (codeownersFileContent: string): MappedData[] => {
    return codeownersFileContent
        .split('\n')
        .filter(x => x && !x.startsWith('#'))
        .map(x => {
            const [path, ...owners] = x.split(/\s+/);
            return {path, owners};
        });
};

export default mapCodeownersFile;
