import * as codeOwnersApi from '../src/index'

(async () => {
    const params = {repo: 'codeowners', owner: 'elaygl'}
    await codeOwnersApi.initializeRemote(params)
})();