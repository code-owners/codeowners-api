# codeowners
Simple module to interact with github [codeowners](https://help.github.com/articles/about-codeowners/)


## API

#### codeownersFileExists()
Returns Promise<Boolean> true if a CODEOWNERS file exists for the given github repo

#### getCodeownersFile()
Returns Promise<String> of the CODEOWNERS file in the given repo

#### filterForCodeOwner(paths: string[], codeowner: string)
Given an array of paths and a codeowner
## Sample Usage


