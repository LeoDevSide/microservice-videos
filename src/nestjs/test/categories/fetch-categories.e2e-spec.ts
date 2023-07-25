import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CATEGORY_PROVIDERS } from '../../src/categories/categories.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { ICategoryRepository } from '@me/micro-videos/src/category/infra'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { CategoriesController } from '../../src/categories/categories.controller'
import { instanceToPlain } from 'class-transformer'
import { PrismaService } from '../../src/database/prisma/prisma.service'

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
describe('CategoriesController (e2e)', () => {
  describe('GET /categories/?queryParams', () => {
    // it('should response error when throws id not found error', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/categories/10609771-fae7-4779-b336-56e2cdda737f')
    //     .send()

    //   expect(res.statusCode).toBe(404)
    //   expect(res.body['message']).toStrictEqual(
    //     'Category 10609771-fae7-4779-b336-56e2cdda737f not found in db',
    //   )
    //   expect(res.body['error']).toStrictEqual('Not Found')
    //   expect(res.body['statusCode']).toStrictEqual(404)
    // })

    // it('should response error 422 when id param in url is not an UUID', async () => {
    //   const { app } = await startApp()
    //   const res = await request(app.getHttpServer())
    //     .get('/categories/invalidid')
    //     .send()

    //   expect(res.statusCode).toBe(422)
    //   expect(res.body['message']).toStrictEqual(
    //     'Validation failed (uuid is expected)',
    //   )
    //   expect(res.body['error']).toStrictEqual('Unprocessable Entity')
    //   expect(res.body['statusCode']).toStrictEqual(422)
    // })

    it('should fetch categories without query param', async () => {
      const { app } = await startApp()
      const repo: ICategoryRepository = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      const fakeCategories = CategoryFakeBuilder.theCategories(5)
        .withName((index) => 'name' + index)
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build()
      await repo.bulkInsert(fakeCategories)
      const response = await request(app.getHttpServer())
        .get(`/categories/`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCategories.map((category) =>
        instanceToPlain(CategoriesController.toResponse(category.toJSON())),
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
    it('should fetch categories with query param', async () => {
      const { app } = await startApp()
      const repo: ICategoryRepository = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      const prisma = app.get(PrismaService)
      await prisma.category.deleteMany() // clear db

      const fakeCategories = CategoryFakeBuilder.theCategories(5)
        .withName((index) => 'searchThis' + index)
        .build()
      await repo.bulkInsert(fakeCategories)
      const dto = {
        page: '2',
        per_page: '2',
        sort: 'name',
        sort_dir: 'desc',
        filter: 'searchThis',
      }
      const urlQuery = new URLSearchParams(dto)
      const response = await request(app.getHttpServer())
        .get(`/categories/?${urlQuery}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body)).toEqual(['data', 'meta'])
      expect(Object.keys(response.body.meta)).toEqual([
        'current_page',
        'per_page',
        'last_page',
        'total',
      ])

      const toPresenter = fakeCategories.map((category) =>
        instanceToPlain(CategoriesController.toResponse(category.toJSON())),
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
