import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
