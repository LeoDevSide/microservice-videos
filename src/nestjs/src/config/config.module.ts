import { DynamicModule, Module } from '@nestjs/common'
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config'
import { join } from 'node:path'
import * as Joi from 'joi'

type CONFIG_SCHEMA_TYPE = {
  DATABASE_VENDOR: 'postgresql'
  DATABASE_NAME: string
  DATABASE_USER: string
  DATABASE_PASS: string
  DATABASE_HOST: string
  DATABASE_PORT: number
  DATABASE_URL: string
}
const DB_SCHEMA: Joi.StrictSchemaMap<CONFIG_SCHEMA_TYPE> = {
  DATABASE_VENDOR: Joi.string().required().valid('postgresql'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASS: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_URL: Joi.string().required(),
}
@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'), // merge envs if exists with default
      ],
      validationSchema: Joi.object({ ...DB_SCHEMA }),
      ...options,
    })
  }
}
