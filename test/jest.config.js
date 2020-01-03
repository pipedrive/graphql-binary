module.exports = {
	rootDir: '..',
	resetModules: true,
	resetMocks: true,
	coverageReporters: ['json', 'lcov', 'clover'],
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.js', '<rootDir>/**/*.js'],
	testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/**/*.test.js'],
	modulePaths: ['<rootDir>']
};