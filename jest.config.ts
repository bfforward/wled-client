export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts", // Collect coverage from all `.ts` files in `src/`
    "!src/index.ts", // Exclude specific files
  ],
  coverageDirectory: "coverage", // Directory to store coverage reports
  coverageReporters: ["text", "lcov", "html"], // Types of reports to generate
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
