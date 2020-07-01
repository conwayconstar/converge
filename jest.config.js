module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/?(*.)+(test|spec).(ts|tsx|js)'],
  moduleNameMapper: {
    '^@Types': '<rootDir>/src/types/index.ts',
    '^@Controllers/(.*)': '<rootDir>/src/controllers/$1',
    '^@Models/(.*)': '<rootDir>/src/models/$1',
    '^@Middleware/(.*)': '<rootDir>/src/middleware/$1',
    '^@Database': '<rootDir>/src/database.ts',
  },
};
