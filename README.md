
[![npm version](https://badge.fury.io/js/codeowners-api.svg)](https://badge.fury.io/js/codeowners-api)

# codeowners-api
Simple module to interact with github [codeowners](https://help.github.com/articles/about-codeowners/)
This npm module was implemented mainly to support the chrome extension - [codeowners-ext](https://github.com/code-owners/codeowners-ext)

### Note on Github Oauth2 access tokens
In order to get all the teams a user is part of, you need to provide a Github access token.
The required permissions are:    
* repos:public_repo
* user:read:user    
For private repos you would need to add access to private repos 

## Quick start

`> yarn add codeowners-api`

```ts
    import {Codeowner} from 'codeowners-api';
    
    const repoParams = {repo: 'my-repo', owner: 'repo-owner'}
    const authParams = {type: 'token', token: 'xxxx'}
    
    const codeOwnersApi = new Codeowner(repoParams, authParams);
    const result = await codeOwnersApi.filterForCodeOwners(
        ['/something/a.py', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx'],
        '@elaygl'
    );

    console.log(result) // [ 'tests/something.txt', 'packages/some/deep/dir/index.tsx' ]
```

## API

#### filterForCodeOwners(paths: string[], users: string[])
Given an array of paths and an array of github users/teams (prefixed with `@`), returns the paths that these users/teams are the codeowners of. 

Example:
```ts
 const result = await codeOwnersApi.filterForCodeOwners(
        ['package.json', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx'],
        ['@elaygl', '@Soluto/mobile-team']
    );
    console.log(result) // ['package.json']
```

#### filterForAuthenticatedUser(paths: string[])
Given an array of paths, returns the paths that this authenticated user is the codeowner of (based on the Auth credentials passed in the constructor). 
Using GithubAPI, the library will also get all the list of teams that this user is part of, inorder to return the mapping which includes this user, and all his/her teams

Example:
```ts
 const result = await codeOwnersApi.filterForAuthenticatedUser(
        ['package.json', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx']
    );
    console.log(result) // ['package.json']
```


#### codeownersFileExists()
Returns `true` if a CODEOWNERS file exists for the given github repo

#### getCodeownersFile()
Returns `string` of the CODEOWNERS file in the given repo

#### getCodeownersMap()
Returns a mapping of the CODEOWNERS file in the given repo.
i.e 
```ts
{
    '/packages/*', ['owner1', 'owner2'],
    '/another/*.js', ['team1', 'owner2'],
}
```

## Testing
`> yarn test` 

## Full Example
Based on this `CODEOWNERS` file:
```
#This is a comment

* @oreporan
/tests/*.txt @elaygl

# Another Comment!!
/tests/test2/someFile.txt @oreporan

/packages/some/ @elaygl
```

Will generate this result:
```ts
    import {Codeowner} from 'codeowners-api';
    
    const repoParams = {repo: 'my-repo', owner: 'repo-owner'}
    const authParams = {type: 'token', token: 'xxxx'}
    
    const codeOwnersApi = new Codeowner(repoParams, authParams);
    const result = await codeOwnersApi.filterForCodeOwners(
        ['/something/a.py', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx'],
        ['@elaygl']
    );

    console.log(result) // [ 'tests/something.txt', 'packages/some/deep/dir/index.tsx' ]
```


### Authors
Ore Poran and Elay Gliskberg