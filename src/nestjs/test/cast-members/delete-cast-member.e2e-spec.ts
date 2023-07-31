import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { ICastMemberRepository } from '@me/micro-videos/src/cast-member/infra'
import { CastMemberFakeBuilder } from '@me/micro-videos/src/cast-member/domain'
import { NotFoundError } from '@me/micro-videos/src/@shared/domain'

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
  describe('DELETE /cast-members/:id', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .delete('/cast-members/10609771-fae7-4779-b336-56e2cdda737f')
        .send()

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'CastMember 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .delete('/cast-members/invalidid')
        .send()

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should delete a castMember', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const fakeCastMember = CastMemberFakeBuilder.aCastMember().build()
      await repo.insert(fakeCastMember)

      const response = await request(app.getHttpServer())
        .delete(`/cast-members/${fakeCastMember.id}`)
        .send()
      expect(response.statusCode).toBe(200)

      expect(
        async () => await repo.findById(fakeCastMember.id),
      ).rejects.toThrow(NotFoundError)
    })
  })
})
