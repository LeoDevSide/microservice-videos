import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { CATEGORY_PROVIDERS } from '../../src/categories/categories.providers'
import { applyGlobalConfig } from '../../src/global-config'

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
  describe('POST /categories', () => {
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer())
        .post('/categories')
        .send({})

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
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
        .post('/categories')
        .send({ description: 2, is_active: 22 })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
        'description must be a string',
        'isActive must be a boolean value',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should create a category', async () => {
      const { app } = await startApp()
      const repo = app.get(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      )
      const response = await request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Category',
          description: 'Description',
        })
      expect(response.statusCode).toBe(201)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'description',
        'is_active',
        'created_at',
      ])

      const category = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: category.id,
          name: category.name,
          description: category.description,
          is_active: true,
          created_at: category.createdAt.toISOString(),
        },
      })
    })
  })
})
