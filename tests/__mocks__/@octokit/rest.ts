const fs = require('fs');

const getTestData = fileName => {
    const testData = fs.readFileSync(`${__dirname}/../../testModels/${fileName}`);
    return Buffer.from(testData).toString('base64');
};

let mockedTeamData = {};
let mockedUserData = {};
let mockedCodeownersFile;

module.exports = class octo {
    public async authenticate() {}

    public SET_MOCK_DATA({codeOwnersFileName, mockedUsername, mockedTeam}) {
        mockedCodeownersFile = codeOwnersFileName;
        mockedUserData = {
            data: {login: mockedUsername},
        };
        const splitTeam = mockedTeam.split('/');
        mockedTeamData = {
            data: [{organization: {login: splitTeam[0]}, slug: splitTeam[1] + 1}],
        };
    }

    public get repos() {
        return {
            getContent: ({path}) => {
                if (path.indexOf('/CODEOWNERS') > -1) return {data: {content: getTestData(mockedCodeownersFile)}};
                return {data: [{name: 'CODEOWNERS', path: '/CODEOWNERS'}]};
            },
        };
    }

    public get users() {
        return {
            getTeams: () => ({data: [{organization: {login: 'TestOrg'}, slug: 'test-team'}]}),
            get: () => ({data: {login: 'elaygl'}}),
        };
    }
};
