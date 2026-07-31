/**
 * Jest setup — stubs for ESM-only dependencies.
 *
 * `nanoid` and `jose` ship ESM-only builds that Jest's CommonJS transform cannot
 * parse. Both are pulled in transitively (nanoid via PetsService, jose via
 * JwtAuthGuard) by specs that never exercise them, so they are stubbed once here
 * rather than in each spec file. Anything that genuinely depends on their
 * behaviour should stub them locally with real values instead.
 */

jest.mock('nanoid', () => ({
  nanoid: (size = 21) => 'n'.repeat(size),
}))

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}))
