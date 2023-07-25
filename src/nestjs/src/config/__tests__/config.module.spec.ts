import { Test } from '@nestjs/testing'
import { ConfigModule } from '../config.module'
import { join } from 'path'

describe('Config Module Unit Tests', () => {
  it('should throw when env variables are not valid', () => {
    expect(() => {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ envFilePath: join(__dirname, '.env.fake') }),
        ],
      })
    }).toThrow(
      'Config validation error: "DATABASE_VENDOR" must be [postgresql]. "DATABASE_USER" is not allowed to be empty. "DATABASE_PASS" is not allowed to be empty. "DATABASE_NAME" is not allowed to be empty. "DATABASE_PORT" must be a number',
    )
  })
})
