const fs = require('fs');

const getTestData = () => {
    const testData = fs.readFileSync(`${__dirname}/../../testModels/CODEOWNERS`);
    return Buffer.from(testData).toString('base64');
};

module.exports = class octo {
    public async authenticate() {}

    public get repos() {
        return {
            getContent: ({path}) => {
                if (path.indexOf('/CODEOWNERS') > -1) return {data: {content: getTestData()}};
                return {data: [{name: 'CODEOWNERS', path: '/CODEOWNERS'}]};
            },
        };
    }

    public get users() {
        return {
            getTeams: () => [{}],
        };
    }
};
