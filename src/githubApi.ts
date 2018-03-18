import * as octokit from '@octokit/rest'

export type GetCodeOwnersFileParams = {
    repo: string,
    owner: string
}

type ContentResponse = {
    name: string,
    path: string,
    data: string
}

const locateInDir = async (params: GetCodeOwnersFileParams, path: string): Promise<string | null> => {
    console.log("Searching in ", path)

    const octo = await new octokit()
    try {
        const search = await octo.repos.getContent({path, ...params})
        const codeOwnersLocation = search.data.filter((x: ContentResponse) => x.name === 'CODEOWNERS')
    
        if (codeOwnersLocation) return codeOwnersLocation[0].path
        return null
    } catch (error) {
        console.log(`Path ${path} doesnt exist`)
        return null
    }
}

const locateCodeOwnersFile = async (params: GetCodeOwnersFileParams): Promise<string> => {
    console.log("locating your CODEOWNERS file...")

    // First Attempt in /
    const root = await locateInDir(params, '/')
    if (root) return root;

    // Second Attempt in /docs/
    const docs = await locateInDir(params, 'docs/')
    if (docs) return docs;

    // Last Attempt in /.github/
    const github = await locateInDir(params, '.github/')
    if (github) return github;
   
    throw new Error("Could not find CODEOWNERS file in allowed paths")
}

export const getCodeOwnersFile = async (params: GetCodeOwnersFileParams): Promise<string> => {
    const path = await locateCodeOwnersFile(params)
    const file = await new octokit().repos.getContent({path, ...params})

    return Buffer.from(file.data.content, 'base64').toString();
}
