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
  describe('GET /categories/:id', () => {
    it('should response error when throws id not found error', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .get('/categories/10609771-fae7-4779-b336-56e2cdda737f')
        .send()

      expect(res.statusCode).toBe(404)
      expect(res.body['message']).toStrictEqual(
        'Category 10609771-fae7-4779-b336-56e2cdda737f not found in db',
      )
      expect(res.body['error']).toStrictEqual('Not Found')
      expect(res.body['statusCode']).toStrictEqual(404)
    })

    it('should response error 422 when id param in url is not an UUID', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .get('/categories/invalidid')
        .send()

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual(
        'Validation failed (uuid is expected)',
      )
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should get a category', async () => {
      const { app } = await startApp()
      const repo: ICategoryRepository = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      const fakeCategory = CategoryFakeBuilder.aCategory().build()
      await repo.insert(fakeCategory)

      const response = await request(app.getHttpServer())
        .get(`/categories/${fakeCategory.id}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'description',
        'is_active',
        'created_at',
      ])

      const categoryFromRepo = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: categoryFromRepo.id,
          name: categoryFromRepo.name,
          description: categoryFromRepo.description,
          is_active: categoryFromRepo.isActive,
          created_at: categoryFromRepo.createdAt.toISOString(),
        },
      })
    })
  })
})
