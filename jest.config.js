/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	rootDir: './',
	resetModules: true,
	clearMocks: true,
	automock: false,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	modulePaths: ['<rootDir>/src', '<rootDir>/tests'],
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	testMatch: ['**/*.test.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
