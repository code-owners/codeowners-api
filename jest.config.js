module.exports = {
    testEnvironment: 'node',
    transform: {
        '.(ts|tsx)': '<rootDir>/preprocessor.js',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testRegex: 'tests/.*.spec.(ts|js)$',
    testPathIgnorePatterns: ['/node_modules/'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
};
