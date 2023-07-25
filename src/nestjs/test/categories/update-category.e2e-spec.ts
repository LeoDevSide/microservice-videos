import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CATEGORY_PROVIDERS } from '../../src/categories/categories.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { ICategoryRepository } from '@me/micro-videos/src/category/infra'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'

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
  describe('PUT /categories', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/categories/10609771-fae7-4779-b336-56e2cdda737f')
        .send({ name: 'test' })

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'Category 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/categories/anyid')
        .send({ name: 2, description: 0, is_active: 'ok' })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'description must be a string',
        'is_active must be a boolean value',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/categories/invalidid')
        .send({ name: 'test' })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .put('/categories/anyid')
        .send({ name: 2, description: 0, is_active: 'ok' })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'description must be a string',
        'is_active must be a boolean value',
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
      const fakeCategory = CategoryFakeBuilder.aCategory().build()
      const repo: ICategoryRepository = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      await repo.insert(fakeCategory)

      const res = await request(app.getHttpServer())
        .put(`/categories/${fakeCategory.id}`)
        .send({ name: 22, description: 2, is_active: 22 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
        'description must be a string',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should update a category', async () => {
      const { app } = await startApp()
      const repo: ICategoryRepository = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      const fakeCategory = CategoryFakeBuilder.aCategory().build()
      await repo.insert(fakeCategory)
      const body = {
        name: 'updated name',
        description: 'Description',
        is_active: false,
      }
      const response = await request(app.getHttpServer())
        .put(`/categories/${fakeCategory.id}`)
        .send(body)
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'description',
        'is_active',
        'created_at',
      ])

      const categoryUpdated = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: categoryUpdated.id,
          name: categoryUpdated.name,
          description: categoryUpdated.description,
          is_active: categoryUpdated.isActive,
          created_at: categoryUpdated.createdAt.toISOString(),
        },
      })
    })
  })
})
