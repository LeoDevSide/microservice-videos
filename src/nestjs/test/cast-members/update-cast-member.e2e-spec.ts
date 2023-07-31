import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { ICastMemberRepository } from '@me/micro-videos/src/cast-member/infra'
import {
  CastMemberFakeBuilder,
  CastMemberType,
} from '@me/micro-videos/src/cast-member/domain'

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
  describe('PUT /cast-members', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/cast-members/10609771-fae7-4779-b336-56e2cdda737f')
        .send({ name: 'test' })

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'CastMember 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/cast-members/anyid')
        .send({ name: 2, type: 3 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'type must be one of the following values: 1, 2',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/cast-members/invalidid')
        .send({ name: 'test' })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when domain throws validation error', async () => {
      const { app } = await startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [] // this line disable validationPipe
        },
      })
      const fakeCastMember = CastMemberFakeBuilder.aCastMember().build()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      await repo.insert(fakeCastMember)

      const res = await request(app.getHttpServer())
        .put(`/cast-members/${fakeCastMember.id}`)
        .send({ name: 22, type: 3 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
        'type must be one of the following values: 1, 2',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should update a castMember', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const fakeCastMember = CastMemberFakeBuilder.aCastMember().build()
      await repo.insert(fakeCastMember)

      const body = {
        name: 'updated name',
        type: CastMemberType.DIRECTOR,
      }
      const response = await request(app.getHttpServer())
        .put(`/cast-members/${fakeCastMember.id}`)
        .send(body)

      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'type',
        'created_at',
      ])

      const castMemberUpdated = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: castMemberUpdated.id,
          name: castMemberUpdated.name,
          type: castMemberUpdated.type,
          created_at: castMemberUpdated.createdAt.toISOString(),
        },
      })
    })
  })
})
