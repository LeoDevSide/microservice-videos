import jestConfig from './jest.config'

export default {
  ...jestConfig,
  testEnvironment: './../prisma/prisma-test-environment.ts',
  testRegex: undefined, // ou comente essa linha se preferir
  displayName: 'Integration tests',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: [
    '<rootDir>/**/application/use-cases/__tests__/integration/**/*.int-spec.ts',
    '<rootDir>/**/infra/repository/prisma/**/*.int-spec.ts',
  ],
}
