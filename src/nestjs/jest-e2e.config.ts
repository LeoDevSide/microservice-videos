import jestConfig from './jest.config'

export default {
  ...jestConfig,
  testEnvironment: './../../@core/prisma/prisma-test-environment.ts',
  testRegex: undefined, // ou comente essa linha se preferir
  displayName: 'E2E tests',
  testPathIgnorePatterns: ['/node_modules/'],
  rootDir: './',
  // testMatch: [
  //   '<rootDir>/**/*.int-spec.ts',
  //   // '<rootDir>/**/infra/repository/prisma/**/*.int-spec.ts',
  // ],
  testMatch: [
    '**/__tests__/integration/**/*.int-spec.ts',
    '**/__tests__/e2e/**/*.e2e-spec.ts',
    '<rootDir>/../**/*.e2e-spec.ts',
  ],
}
