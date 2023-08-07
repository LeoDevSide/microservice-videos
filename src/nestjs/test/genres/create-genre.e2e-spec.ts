import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { GENRE_PROVIDERS } from '../../src/genres/genres.providers'
import { applyGlobalConfig } from '../../src/global-config'
import { CreateGenreDto } from '../../src/genres/dto/create-genre.dto'
import { CategoryFakeBuilder } from '@me/micro-videos/src/category/domain'
import { PrismaService } from '../../src/database/prisma/prisma.service'
import { PrismaCategoryRepository } from '@me/micro-videos/src/category/infra'

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

describe('GenresController (e2e)', () => {
  describe('POST /genres', () => {
    const category = CategoryFakeBuilder.aCategory().build()
    const category2 = CategoryFakeBuilder.aCategory().build()
    beforeAll(async () => {
      const db = new PrismaService()
      const categoryRepo = new PrismaCategoryRepository(db)
      await categoryRepo.bulkInsert([category, category2])
    })
    it('should response error 422 if body is invalid', async () => {
      const { app } = await startApp()
      const res = await request(app.getHttpServer()).post('/genres').send({})

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'categories_id should not be empty',
        'categories_id must be an array',
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
        .post('/genres')
        .send({ categories_id: [] })

      expect(res.statusCode).toBe(422)
      expect(res.body['message']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
        'categoriesId should not be empty',
      ])
      expect(res.body['error']).toStrictEqual('Unprocessable Entity')
      expect(res.body['statusCode']).toStrictEqual(422)
    })

    it('should create a genre', async () => {
      const { app } = await startApp()
      const repo = app.get(
        GENRE_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      )
      const input: CreateGenreDto = {
        name: 'Genre',
        categories_id: [category.id, category2.id],
      }
      const response = await request(app.getHttpServer())
        .post('/genres')
        .send(input)

      expect(response.statusCode).toBe(201)
      expect(Object.keys(response.body.data)).toEqual([
        'id',
        'name',
        'is_active',
        'categories_id',
        'created_at',
      ])

      const genre = await repo.findById(response.body.data['id'])

      expect(response.body).toEqual({
        data: {
          id: genre.id,
          name: genre.name,
          is_active: genre.isActive,
          categories_id: [category.id, category2.id],
          created_at: genre.createdAt.toISOString(),
        },
      })
    })
  })
})
