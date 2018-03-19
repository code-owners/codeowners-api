import {MappedData} from '../types';

const mapCodeownersFile = (codeownersFileContent: string): MappedData[] => {
    return codeownersFileContent
        .split('\n')
        .filter(x => x && !x.startsWith('#'))
        .map(x => {
            const line = x.trim();
            const [path, ...owners] = line.split(/\s+/);
            return {path, owners};
        });
};

export default mapCodeownersFile;
