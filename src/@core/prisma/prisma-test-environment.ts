import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment'
import { exec } from 'child_process'
import dotenv from 'dotenv'
import NodeEnvironment from 'jest-environment-node'
import { Client } from 'pg'
import util from 'util'
import crypto from 'crypto'
dotenv.config({ path: './.env.test' })
const execSync = util.promisify(exec)

// const prismaBinPath = path.join(__dirname, '../../../node_modules/.bin/prisma')
// // relative path from this file to prisma bin

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string
  private connectionString: string

  private foundEnv(): boolean {
    const isNotUndefined =
      process.env.DATABASE_URL !== undefined &&
      process.env.DB_USER !== undefined
    return isNotUndefined
  }

  get defaultConnectionStringValue() {
    const defaultURL = `postgresql://test:test@db_test:5432/microvideos_test?schema=${this.schema}`
    return defaultURL
  }

  private makeConnectionStringFromEnv(values: any) {
    return `${values.dbProvider}://${values.dbUser}:${values.dbPass}@${values.dbHost}:${values.dbPort}/${values.dbName}?schema=${this.schema}`
  }

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)
    const values: any = {
      dbUser: process.env.DB_USER,
      dbPass: process.env.DB_PASS,
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbName: process.env.DB_NAME,
      dbProvider: process.env.DB_PROVIDER,
    }
    this.schema = `test_${crypto.randomUUID()}`

    const isEnvValid = this.foundEnv()
    if (!isEnvValid) {
      console.log(
        'WARN: ENV NOT FOUND.PLEASE CHECK IF THIS IS CORRECT ENV PATH: ' +
          process.cwd() +
          '/.env.test' +
          '\n TRYING TO INJECT DEFAULT DB URL:' +
          this.defaultConnectionStringValue,
      )
      // this.connectionString = `postgresql://admin:pass@db:5432/microvideos?schema=${this.schema}`
      this.connectionString = this.defaultConnectionStringValue
      process.env.DATABASE_URL = this.defaultConnectionStringValue
      this.global.process.env.DATABASE_URL = this.defaultConnectionStringValue
      return
    }

    this.connectionString = this.makeConnectionStringFromEnv(values)
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString
  }

  async setup() {
    // await execSync(`${prismaBinPath} migrate deploy`)
    await execSync(`npm run migrate:dep -w @me/micro-videos`)

    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
    return super.teardown()
  }
}
