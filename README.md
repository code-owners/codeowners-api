# codeowners
Simple module to interact with github [codeowners](https://help.github.com/articles/about-codeowners/)


## API

#### codeownersFileExists()
Returns `true` if a CODEOWNERS file exists for the given github repo

#### getCodeownersFile()
Returns `string` of the CODEOWNERS file in the given repo

#### filterForCodeOwner(paths: string[], codeowner: string)
Given an array of paths and the name of a codeowner (name or team), returns the paths that this user/team is the codeowner of. 

## Testing
`> yarn test` 

## Sample Usage
Based on CODEOWNERS file:
```
#This is a comment

* @oreporan
/tests/*.txt @elaygl

# Another Comment!!
/tests/test2/someFile.txt @oreporan

/packages/some/ @elaygl
```

```js
    const params = {repo: '', owner: '', auth: ''};
    const codeOwnersApi = new Codeowner(params);
    const result = await codeOwnersApi.filterForCodeOwner(
        ['/something/a.py', 'tests/something.js', 'tests/something.txt', 'packages/some/deep/dir/index.tsx'],
        '@elaygl'
    );

    console.log(result) // [ 'tests/something.txt', 'packages/some/deep/dir/index.tsx' ]
```


