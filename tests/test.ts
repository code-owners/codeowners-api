import * as codeOwnersApi from '../src/index'

(async () => {
    const params = {repo: 'code-owners-api', owner: 'oreporan'}
    await codeOwnersApi.initializeRemote(params)
})();