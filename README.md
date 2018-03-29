# codeowners-api
Simple module to interact with github [codeowners](https://help.github.com/articles/about-codeowners/)
This npm module was implemented mainly to support the chrome extension - [codeowners-ext](https://github.com/code-owners/codeowners-ext)

**Note on Github Oauth2 access tokens**
In order to get all the teams a user is part of, you need to provide a Github access token.


## API

#### filterForCodeOwner(paths: string[], user: string)
Given an array of paths and the name of a github user (prefixed with `@`), returns the paths that this user is the codeowner of. 
Using GithubAPI, the library will also get all the list of teams that this user is part of, inorder to return the mapping which includes this user, and all his/her teams

#### codeownersFileExists()
Returns `true` if a CODEOWNERS file exists for the given github repo

#### getCodeownersFile()
Returns `string` of the CODEOWNERS file in the given repo

## Testing
`> yarn test` 

## Sample Usage
Based on this `CODEOWNERS` file:
```
#This is a comment

* @oreporan
/tests/*.txt @elaygl

# Another Comment!!
/tests/test2/someFile.txt @oreporan

/packages/some/ @elaygl
```
Will create this result:
```js
    const params = {repo: '', owner: '', auth: ''};
    const codeOwnersApi = new Codeowner(params);
    const result = await codeOwnersApi.filterForCodeOwner(
        ['/something/a.py', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx'],
        '@elaygl'
    );

    console.log(result) // [ 'tests/something.txt', 'packages/some/deep/dir/index.tsx' ]
```


### Authors
Ore Poran and Elay Gliskberg