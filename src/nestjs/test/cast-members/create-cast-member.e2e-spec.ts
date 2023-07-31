import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { CastMemberType } from '@me/micro-videos/src/cast-member/domain'

async function startApp({
  beforeInit,
}: {
  beforeInit?: (app: INestApplication) => void
} = {}) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()
  const _app: INestApplication = moduleFixture.createNestApplication()
  applyGlobalConfig(_app)
  beforeInit && beforeInit(_app)
  await _app.init()

  return {
    get app() {
      return _app
    },
  }
}
describe('CastMembersController (e2e)', () => {
  describe('POST /cast-members', () => {
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .post('/cast-members')
        .send({})

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'type must be one of the following values: 1, 2',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when domain throws validation error', async () => {
      const { app } = await startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [] // this line disable validationPipe
        },
      })

      const res = await request(app.getHttpServer())
        .post('/cast-members')
        .send({ type: 3 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
        'type must be one of the following values: 1, 2',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should create a castMember', async () => {
      const { app } = await startApp()
      const repo = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const response = await request(app.getHttpServer())
        .post('/cast-members')
        .send({
          name: 'CastMember',
          type: CastMemberType.ACTOR,
        })
      expect(response.statusCode).toBe(201)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'type',
        'created_at',
      ])

      const castMember = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: castMember.id,
          name: castMember.name,
          type: CastMemberType.ACTOR,
          created_at: castMember.createdAt.toISOString(),
        },
      })
    })
  })
})
