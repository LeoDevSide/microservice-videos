import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { ICastMemberRepository } from '@me/micro-videos/src/cast-member/infra'
import { CastMemberFakeBuilder } from '@me/micro-videos/src/cast-member/domain'
import { CastMembersController } from '../../src/cast-members/cast-members.controller'
import { instanceToPlain } from 'class-transformer'
import { PrismaService } from '../../src/database/prisma/prisma.service'
import qs from 'qs'

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
  describe('GET /cast-members/?queryParams', () => {
    // it('should response error when throws id not found error', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/cast-members/10609771-fae7-4779-b336-56e2cdda737f')
    //     .send()

    //   expect(res.statusCode).toBe(404)
    //   expect(res.body['message']).toStrictEqual(
    //     'CastMember 10609771-fae7-4779-b336-56e2cdda737f not found in db',
    //   )
    //   expect(res.body['error']).toStrictEqual('Not Found')
    //   expect(res.body['statusCode']).toStrictEqual(404)
    // })

    // it('should response error 422 when id param in url is not an UUID', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/cast-members/invalidid')
    //     .send()

    //   expect(res.statusCode).toBe(422)
    //   expect(res.body['message']).toStrictEqual(
    //     'Validation failed (uuid is expected)',
    //   )
    //   expect(res.body['error']).toStrictEqual('Unprocessable Entity')
    //   expect(res.body['statusCode']).toStrictEqual(422)
    // })

    it('should fetch castMembers without query param', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const fakeCastMembers = CastMemberFakeBuilder.theCastMembers(5)
        .withName((index) => 'name' + index)
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build()
      await repo.bulkInsert(fakeCastMembers)
      const response = await request(app.getHttpServer())
        .get(`/cast-members/`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCastMembers.map((castMember) =>
        instanceToPlain(CastMembersController.toResponse(castMember.toJSON())),
      )
      const toExpected = [
        toPresenter[4],
        toPresenter[3],
        toPresenter[2],
        toPresenter[1],
        toPresenter[0],
      ]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 1,
          per_page: 15,
          last_page: 1,
          total: 5,
        },
      })
    })
    it('should fetch castMembers with query param', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const prisma = app.get(PrismaService)
      await prisma.castMember.deleteMany() // clear db

      const fakeCastMembers = CastMemberFakeBuilder.theCastMembers(5)
        .withName((index) => '' + index)
        .build()
      await repo.bulkInsert(fakeCastMembers)
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/cast-members/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCastMembers.map((castMember) =>
        instanceToPlain(CastMembersController.toResponse(castMember.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
    it('should fetch castMembers with filter name query param', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const prisma = app.get(PrismaService)
      await prisma.castMember.deleteMany() // clear db

      const fakeCastMembers = CastMemberFakeBuilder.theCastMembers(5)
        .withName((index) => 'searchThis' + index)
        .build()
      const unserchableMember = CastMemberFakeBuilder.aCastMember().build()
      await repo.bulkInsert([...fakeCastMembers, unserchableMember])
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { name: 'searchThis' },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/cast-members/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCastMembers.map((castMember) =>
        instanceToPlain(CastMembersController.toResponse(castMember.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
    it('should fetch castMembers with filter type query param', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const prisma = app.get(PrismaService)
      await prisma.castMember.deleteMany() // clear db

      const fakeCastMembers = CastMemberFakeBuilder.theCastMembers(5)
        .withName((index) => '' + index)
        .withType(1)
        .build()
      const unserchableMember = CastMemberFakeBuilder.aCastMember()
        .withType(2)
        .build()
      await repo.bulkInsert([...fakeCastMembers, unserchableMember])
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { type: 1 },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/cast-members/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCastMembers.map((castMember) =>
        instanceToPlain(CastMembersController.toResponse(castMember.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })

    it('should fetch castMembers with filter type & name query param', async () => {
      const { app } = await startApp()
      const repo: ICastMemberRepository = app.get(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      )
      const prisma = app.get(PrismaService)
      await prisma.castMember.deleteMany() // clear db

      const fakeCastMembers = CastMemberFakeBuilder.theCastMembers(5)
        .withName((index) => 'searchThis' + index)
        .withType(1)
        .build()
      const unserchableMembers = CastMemberFakeBuilder.theCastMembers(2).build()
      await repo.bulkInsert([...fakeCastMembers, ...unserchableMembers])
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: { name: 'searchThis', type: 1 },
      }
      const urlQuery = qs.stringify(dto)
      const response = await request(app.getHttpServer())
        .get(`/cast-members/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCastMembers.map((castMember) =>
        instanceToPlain(CastMembersController.toResponse(castMember.toJSON())),
      )
      const toExpected = [toPresenter[2], toPresenter[1]]
      expect(response.body).toEqual({
        data: toExpected,
        meta: {
          current_page: 2,
          per_page: 2,
          last_page: 3,
          total: 5,
        },
      })
    })
  })
})
